// server/dataService.js
// Сервис для работы с данными DevExtreme

// Реальные имена
const firstNames = [
    'Александр', 'Дмитрий', 'Максим', 'Сергей', 'Андрей', 'Алексей', 'Артем', 'Иван', 'Михаил', 'Евгений',
    'Владимир', 'Николай', 'Виктор', 'Павел', 'Роман', 'Олег', 'Василий', 'Георгий', 'Константин', 'Тимофей',
    'Анна', 'Мария', 'Елена', 'Ольга', 'Татьяна', 'Наталья', 'Ирина', 'Светлана', 'Юлия', 'Екатерина',
    'Анастасия', 'Виктория', 'Ксения', 'Полина', 'Дарья', 'Алина', 'Вероника', 'Валерия', 'Александра', 'Евгения'
];

// Реальные фамилии
const lastNames = [
    'Иванов', 'Петров', 'Сидоров', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев', 'Соколов', 'Михайлов', 'Новиков',
    'Федоров', 'Морозов', 'Волков', 'Алексеев', 'Лебедев', 'Семенов', 'Егоров', 'Павлов', 'Козлов', 'Степанов',
    'Николаев', 'Орлов', 'Андреев', 'Макаров', 'Никитин', 'Захаров', 'Зайцев', 'Соловьев', 'Борисов', 'Яковлев',
    'Григорьева', 'Александрова', 'Кузнецова', 'Попова', 'Соколова', 'Иванова', 'Петрова', 'Сидорова', 'Смирнова', 'Васильева'
];

// Отделы
const departments = [
    'IT', 'HR', 'Sales', 'Marketing', 'Finance', 'Operations', 'R&D',
    'Customer Support', 'Legal', 'Administration', 'Product Management', 'Design'
];

// Должности
const positions = [
    'Разработчик', 'Старший разработчик', 'Team Lead', 'Менеджер проекта', 'Аналитик',
    'Дизайнер', 'Продукт-менеджер', 'HR-менеджер', 'Менеджер по продажам', 'Маркетолог',
    'Системный администратор', 'DevOps инженер', 'Тестировщик', 'Бизнес-аналитик', 'Архитектор'
];

// Города
const cities = [
    'Москва', 'Санкт-Петербург', 'Казань', 'Новосибирск', 'Екатеринбург', 'Нижний Новгород',
    'Самара', 'Ростов-на-Дону', 'Уфа', 'Красноярск', 'Воронеж', 'Пермь', 'Волгоград',
    'Краснодар', 'Челябинск', 'Омск', 'Тюмень', 'Иркутск', 'Хабаровск', 'Владивосток'
];

// Навыки
const skills = [
    'JavaScript', 'React', 'DevExtreme', 'Node.js', 'Python', 'Java', 'C#', 'SQL',
    'MongoDB', 'Docker', 'AWS', 'TypeScript', 'Vue.js', 'Angular', 'PHP', 'Go',
    'Ruby', 'Swift', 'Kotlin', 'GraphQL', 'Redis', 'Kafka', 'Kubernetes', 'Terraform'
];

// Генерация реалистичных данных
const generateTestData = () => {
    const employees = [];

    for (let i = 1; i <= 20000; i++) {
        // Выбираем случайные имя и фамилию
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const fullName = `${firstName} ${lastName}`;

        // Генерируем email
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@company.ru`;

        // Генерируем навыки
        const employeeSkills = [];
        const numSkills = Math.floor(Math.random() * 5) + 1;
        const shuffledSkills = [...skills];
        for (let j = 0; j < numSkills; j++) {
            const skill = shuffledSkills[Math.floor(Math.random() * shuffledSkills.length)];
            if (!employeeSkills.includes(skill)) {
                employeeSkills.push(skill);
            }
        }

        // Дата найма
        const hireDate = new Date(
            2015 + Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
        );

        employees.push({
            ID: i,
            FirstName: firstName,
            LastName: lastName,
            FullName: fullName,
            Email: email,
            Age: 22 + Math.floor(Math.random() * 40),
            Department: departments[Math.floor(Math.random() * departments.length)],
            Position: positions[Math.floor(Math.random() * positions.length)],
            City: cities[Math.floor(Math.random() * cities.length)],
            Salary: 60000 + Math.floor(Math.random() * 200000),
            HireDate: hireDate,
            IsActive: Math.random() > 0.25,
            Skills: employeeSkills,
            Rating: Math.floor(Math.random() * 5) + 1,
            Phone: `+7 (9${Math.floor(Math.random() * 10)}) ${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 1000)}`,
            About: `Сотрудник отдела ${departments[Math.floor(Math.random() * departments.length)]}, занимается ${positions[Math.floor(Math.random() * positions.length)]}.`
        });
    }

    return employees;
};

let testData = generateTestData();

// Фильтрация по поисковому запросу
const filterBySearch = (items, searchValue, searchFields) => {
    if (!searchValue || searchValue === '') return items;

    const searchLower = searchValue.toLowerCase().trim();
    return items.filter(item => {
        return searchFields.some(field => {
            const value = item[field];
            if (value === null || value === undefined) return false;
            return String(value).toLowerCase().includes(searchLower);
        });
    });
};

// Фильтрация по сложному фильтру DevExtreme
// server/dataService.js - упрощенная версия

const filterByComplexFilter = (items, filter) => {
    if (!filter || filter.length === 0) return items;

    // Функция для вычисления одного условия [field, operator, value]
    const evaluateCondition = (item, condition) => {
        if (!Array.isArray(condition) || condition.length !== 3) return true;

        const [field, operator, value] = condition;
        const itemValue = item[field];

        if (itemValue === undefined || itemValue === null) return false;

        switch (operator) {
            case '=':
            case '==':
                return String(itemValue) === String(value);
            case '<>':
            case '!=':
                return String(itemValue) !== String(value);
            case '>':
                return Number(itemValue) > Number(value);
            case '>=':
                return Number(itemValue) >= Number(value);
            case '<':
                return Number(itemValue) < Number(value);
            case '<=':
                return Number(itemValue) <= Number(value);
            case 'contains':
                return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
            default:
                return true;
        }
    };

    // Преобразуем фильтр в плоский список условий с операторами
    const parseFilter = (filterArr) => {
        const conditions = [];
        let currentOperator = 'and';

        for (let i = 0; i < filterArr.length; i++) {
            const item = filterArr[i];

            if (typeof item === 'string' && (item === 'and' || item === 'or')) {
                currentOperator = item;
            } else if (Array.isArray(item)) {
                conditions.push({ condition: item, operator: currentOperator });
            }
        }

        return conditions;
    };

    const parsedConditions = parseFilter(filter);

    if (parsedConditions.length === 0) return items;

    return items.filter(item => {
        // Для каждого условия применяем его оператор
        let result = null;

        for (const { condition, operator } of parsedConditions) {
            const matches = evaluateCondition(item, condition);

            if (result === null) {
                result = matches;
            } else if (operator === 'and') {
                result = result && matches;
            } else if (operator === 'or') {
                result = result || matches;
            }

            // Если уже true и оператор or, можно выходить
            //if (operator === 'or' && result === true) break;
            // Если уже false и оператор and, можно выходить
            //if (operator === 'and' && result === false) break;
        }

        return result !== null ? result : false;
    });
};

// Сортировка
const sortItems = (items, sort) => {
    if (!sort || sort.length === 0) return items;

    return [...items].sort((a, b) => {
        for (const s of sort) {
            const selector = s.selector || s.field;
            const desc = s.desc === true;

            let aVal = a[selector];
            let bVal = b[selector];

            if (typeof aVal === 'string') aVal = aVal.toLowerCase();
            if (typeof bVal === 'string') bVal = bVal.toLowerCase();

            if (aVal < bVal) return desc ? 1 : -1;
            if (aVal > bVal) return desc ? -1 : 1;
        }
        return 0;
    });
};

// Настройка задержки (в миллисекундах)
const DELAY_MS = process.env.DELAY_MS || 1000;

// Функция для создания задержки
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Основная функция обработки запроса
const processQuery = async (query) => {
    console.log('\n' + '='.repeat(60));
    console.log('📊 DevExtreme DataService Request');
    console.log('='.repeat(60));

    // Симулируем задержку сети/базы данных
    console.log(`⏳ Задержка ${DELAY_MS}ms...`);
    await delay(DELAY_MS);

    // Выводим все полученные параметры
    Object.keys(query).forEach(key => {
        if (query[key] !== undefined && query[key] !== null) {
            if (key === 'searchValue') {
                console.log(`  🔍 ${key}: "${query[key]}"`);
            } else if (key === 'filter') {
                console.log(`  🎯 ${key}:`, JSON.stringify(query[key], null, 2));
            } else {
                console.log(`  ${key}:`, typeof query[key] === 'object' ? JSON.stringify(query[key], null, 2) : query[key]);
            }
        }
    });

    let items = [...testData];

    // 1. Применяем сложную фильтрацию (если есть)
    if (query.filter) {
        if (Array.isArray(query.filter) && query.filter.length > 0) {
            console.log(`  🎯 Применяем фильтр...`);
            items = filterByComplexFilter(items, query.filter);
            console.log(`  ✅ После фильтрации: осталось ${items.length} записей`);
        }
    }

    // 2. Применяем поиск (если есть)
    if (query.searchValue && query.searchValue !== '') {
        const searchFields = query.searchExpr || ['FullName', 'Email', 'Department', 'Position', 'City'];
        items = filterBySearch(items, query.searchValue, searchFields);
        console.log(`  ✅ Поиск "${query.searchValue}": найдено ${items.length} записей`);

        // Выводим первые 5 найденных имен для отладки
        if (items.length > 0 && items.length <= 20) {
            console.log(`  📝 Найдены: ${items.slice(0, 5).map(i => i.FullName).join(', ')}${items.length > 5 ? '...' : ''}`);
        }
    }

    const totalCount = items.length;

    // 3. Применяем сортировку
    if (query.sort && query.sort.length > 0) {
        items = sortItems(items, query.sort);
        console.log(`  ✅ Сортировка: применена`);
    }

    // 4. Применяем пагинацию
    const skip = query.skip ? parseInt(query.skip) : 0;
    const take = query.take ? parseInt(query.take) : 20;

    const data = items.slice(skip, skip + take);

    console.log(`  📦 Результат: ${data.length} записей (всего ${totalCount}), skip=${skip}, take=${take}`);
    console.log('='.repeat(60) + '\n');

    return {
        data: data,
        totalCount: totalCount
    };
};

// Получение записи по ключу
const getByKey = (key) => {
    const id = parseInt(key);
    const item = testData.find(item => item.ID === id);

    console.log(`🔑 byKey запрос для ID: ${key} - ${item ? `найдено: ${item.FullName}` : 'не найдено'}`);

    if (!item) {
        return null;
    }
    return item;
};

// Получение нескольких записей по ключам
const getByKeys = (keys) => {
    if (!keys || keys.length === 0) return [];
    const ids = keys.map(k => parseInt(k));
    const items = testData.filter(item => ids.includes(item.ID));
    console.log(`🔑 byKeys запрос для ${keys.length} ключей, найдено ${items.length} записей`);
    return items;
};

// Получение статистики
const getStats = () => {
    return {
        total: testData.length,
        departments: [...new Set(testData.map(item => item.Department))],
        positions: [...new Set(testData.map(item => item.Position))],
        cities: [...new Set(testData.map(item => item.City))]
    };
};

// Сброс данных к исходному состоянию
const resetData = () => {
    testData = generateTestData();
    console.log('🔄 Данные сброшены к исходному состоянию');
    return testData;
};

// Поиск по имени для быстрого теста
const searchByName = (name) => {
    const results = testData.filter(item =>
        item.FullName.toLowerCase().includes(name.toLowerCase()) ||
        item.FirstName.toLowerCase().includes(name.toLowerCase()) ||
        item.LastName.toLowerCase().includes(name.toLowerCase())
    );
    console.log(`🔍 Поиск по имени "${name}": найдено ${results.length} записей`);
    return results;
};

module.exports = {
    processQuery,
    getByKey,
    getByKeys,
    getStats,
    resetData,
    searchByName,
    testData
};