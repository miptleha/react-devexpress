import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Tab, Tabs } from 'react-bootstrap';
import DataGrid from './components/DataGrid';
import Dashboard from './components/Dashboard';
import FormExample from './components/FormExample';
import TagBoxCustomStore from './components/TagBoxCustomStore';
import QwenGenerated from './components/QwenGenerated';
import axios from 'axios';

const API_URL = '/api';

function App() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [usersRes, productsRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/users`),
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/dashboard-stats`)
      ]);
      setUsers(usersRes.data);
      setProducts(productsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/users/${id}`, updatedData);
      setUsers(users.map(user => user.id === id ? response.data : user));
    } catch (error) {
      console.error('Ошибка обновления:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  const handleAddUser = async (newUser) => {
    try {
      const response = await axios.post(`${API_URL}/users`, newUser);
      setUsers([...users, response.data]);
    } catch (error) {
      console.error('Ошибка добавления:', error);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Загрузка...</div>;
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">
            📊 DevExtreme Test App 2026
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Tabs defaultActiveKey="dashboard" className="mb-3" fill>
          <Tab eventKey="dashboard" title="📈 Дашборд">
            <Dashboard stats={stats} users={users} products={products} />
          </Tab>
          
          <Tab eventKey="users" title="👥 Пользователи">
            <DataGrid
              dataSource={users}
              columns={[
                { dataField: 'id', caption: 'ID', width: 70 },
                { dataField: 'name', caption: 'Имя' },
                { dataField: 'email', caption: 'Email' },
                { dataField: 'age', caption: 'Возраст', dataType: 'number' },
                { dataField: 'role', caption: 'Роль' }
              ]}
              onUpdate={handleUpdateUser}
              onDelete={handleDeleteUser}
              onAdd={handleAddUser}
              title="Управление пользователями"
            />
          </Tab>
          
          <Tab eventKey="products" title="📦 Товары">
            <DataGrid
              dataSource={products}
              columns={[
                { dataField: 'id', caption: 'ID', width: 70 },
                { dataField: 'name', caption: 'Название' },
                { dataField: 'price', caption: 'Цена', dataType: 'number', format: 'currency' },
                { dataField: 'category', caption: 'Категория' },
                { dataField: 'inStock', caption: 'В наличии', dataType: 'boolean' }
              ]}
              title="Управление товарами"
              readOnly
            />
          </Tab>
          
          <Tab eventKey="form" title="📝 Формы">
            <FormExample onAddUser={handleAddUser} />
          </Tab>
          
          <Tab eventKey="tagbox-cs" title="🏷️ TagBox CustomStore">
            <TagBoxCustomStore />
          </Tab>
          
          <Tab eventKey="qwen-generated" title="🤖 Qwen Generated">
            <QwenGenerated />
          </Tab>
        </Tabs>
      </Container>
    </>
  );
}

export default App;