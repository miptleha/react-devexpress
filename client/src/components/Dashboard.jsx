import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const Dashboard = ({ stats, users, products }) => {
  return (
    <>
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center bg-primary text-white">
            <Card.Body>
              <h3>{stats?.totalUsers || 0}</h3>
              <div>Всего пользователей</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-success text-white">
            <Card.Body>
              <h3>{stats?.totalProducts || 0}</h3>
              <div>Всего товаров</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-info text-white">
            <Card.Body>
              <h3>{stats?.averageAge || 0}</h3>
              <div>Средний возраст</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-warning text-white">
            <Card.Body>
              <h3>{stats?.activeProducts || 0}</h3>
              <div>Товаров в наличии</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>Последние пользователи</Card.Header>
            <Card.Body>
              <ul className="list-unstyled">
                {users?.slice(0, 3).map(user => (
                  <li key={user.id} className="mb-2">
                    <strong>{user.name}</strong> - {user.role} ({user.age} лет)
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>Товары в наличии</Card.Header>
            <Card.Body>
              <ul className="list-unstyled">
                {products?.filter(p => p.inStock).slice(0, 3).map(product => (
                  <li key={product.id} className="mb-2">
                    <strong>{product.name}</strong> - {product.price} ₽
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;