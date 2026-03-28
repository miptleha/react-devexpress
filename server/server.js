const express = require('express');
const cors = require('cors');
const dataService = require('./dataService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Логирование всех запросов
app.use((req, res, next) => {
  console.log(`\n📡 ${req.method} ${req.url}`);
  if (Object.keys(req.query).length > 0) {
    console.log('  Query params:', req.query);
  }
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('  Body:', req.body);
  }
  next();
});

// ==================== DevExtreme DataService Endpoint ====================

// Основной endpoint для работы с данными
app.get('/api/dataservice', async (req, res) => {
  try {
    console.log('\n🔵 ===== DevExtreme DataService Request =====');
    
    // Парсим все параметры из запроса
    const query = {};
    
    // Стандартные параметры DevExtreme
    const params = [
      'filter', 'group', 'groupSummary', 'parentIds', 'requireGroupCount',
      'requireTotalCount', 'searchExpr', 'searchOperation', 'searchValue',
      'select', 'sort', 'skip', 'take', 'totalSummary', 'userData'
    ];
    
    params.forEach(param => {
      if (req.query[param]) {
        try {
          // Пытаемся распарсить JSON
          query[param] = JSON.parse(req.query[param]);
        } catch (e) {
          // Если не JSON, оставляем как строку
          query[param] = req.query[param];
        }
      }
    });
    
    // Добавляем requireTotalCount если нужно
    if (req.query.requireTotalCount === 'true') {
      query.requireTotalCount = true;
    }
    
    // Обрабатываем запрос
    const result = await dataService.processQuery(query);
    
    // Формируем ответ в формате, который ожидает DevExtreme
    const response = {
      data: result.data,
      totalCount: result.totalCount
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('❌ Ошибка в DataService:', error);
    res.status(500).json({ error: error.message });
  }
});

// Получение записи по ключу (для byKey в SelectBox, Lookup, TagBox)
app.get('/api/dataservice/:key', (req, res) => {
  try {
    const key = req.params.key;
    const item = dataService.getByKey(key);
    
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: `Record with ID ${key} not found` });
    }
  } catch (error) {
    console.error('❌ Ошибка в byKey:', error);
    res.status(500).json({ error: error.message });
  }
});

// Массовое получение записей по ключам (для TagBox)
app.post('/api/dataservice/bykeys', (req, res) => {
  try {
    const { keys } = req.body;
    if (!keys || !Array.isArray(keys)) {
      return res.status(400).json({ error: 'keys must be an array' });
    }
    const items = dataService.getByKeys(keys);
    res.json(items);
  } catch (error) {
    console.error('❌ Ошибка в byKeys:', error);
    res.status(500).json({ error: error.message });
  }
});

// Получение статистики по данным
app.get('/api/dataservice/stats', (req, res) => {
  try {
    const stats = dataService.getStats();
    res.json(stats);
  } catch (error) {
    console.error('❌ Ошибка получения статистики:', error);
    res.status(500).json({ error: error.message });
  }
});

// Сброс данных
app.post('/api/dataservice/reset', (req, res) => {
  try {
    const data = dataService.resetData();
    res.json({ message: 'Data reset successfully', count: data.length });
  } catch (error) {
    console.error('❌ Ошибка сброса данных:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== Старые эндпоинты (для совместимости) ====================

let users = [
  { id: 1, name: 'Иван Петров', email: 'ivan@example.com', age: 28, role: 'Администратор' },
  { id: 2, name: 'Мария Сидорова', email: 'maria@example.com', age: 32, role: 'Пользователь' },
  { id: 3, name: 'Алексей Смирнов', email: 'alexey@example.com', age: 25, role: 'Пользователь' },
  { id: 4, name: 'Елена Кузнецова', email: 'elena@example.com', age: 35, role: 'Редактор' },
  { id: 5, name: 'Дмитрий Васильев', email: 'dmitry@example.com', age: 29, role: 'Пользователь' }
];

let products = [
  { id: 1, name: 'Ноутбук', price: 45000, category: 'Электроника', inStock: true },
  { id: 2, name: 'Смартфон', price: 25000, category: 'Электроника', inStock: true },
  { id: 3, name: 'Наушники', price: 3500, category: 'Аксессуары', inStock: false },
  { id: 4, name: 'Клавиатура', price: 2800, category: 'Аксессуары', inStock: true },
  { id: 5, name: 'Монитор', price: 18500, category: 'Электроника', inStock: true }
];

// Users endpoints
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    ...req.body
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    res.json(users[index]);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  users = users.filter(u => u.id !== id);
  res.status(204).send();
});

// Products endpoints
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Dashboard stats
app.get('/api/dashboard-stats', (req, res) => {
  res.json({
    totalUsers: users.length,
    totalProducts: products.length,
    averageAge: Math.round(users.reduce((sum, u) => sum + u.age, 0) / users.length),
    activeProducts: products.filter(p => p.inStock).length
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 SERVER STARTED');
  console.log('='.repeat(60));
  console.log(`📡 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📊 API доступен по адресу: http://localhost:${PORT}/api`);
  console.log(`🎯 DevExtreme DataService: http://localhost:${PORT}/api/dataservice`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log('\n📋 Доступные эндпоинты:');
  console.log(`   GET  /api/dataservice      - основной endpoint с пагинацией/фильтрацией`);
  console.log(`   GET  /api/dataservice/:key - получение записи по ID`);
  console.log(`   POST /api/dataservice/bykeys - получение нескольких записей`);
  console.log(`   GET  /api/dataservice/stats - статистика по данным`);
  console.log(`   POST /api/dataservice/reset - сброс данных`);
  console.log(`   GET  /api/users            - список пользователей`);
  console.log(`   GET  /api/products         - список товаров`);
  console.log(`   GET  /api/dashboard-stats  - статистика для дашборда`);
  console.log('='.repeat(60) + '\n');
});