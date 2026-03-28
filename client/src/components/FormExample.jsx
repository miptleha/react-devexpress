import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

const FormExample = ({ onAddUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    role: 'Пользователь'
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddUser(formData);
    setShowSuccess(true);
    setFormData({ name: '', email: '', age: '', role: 'Пользователь' });
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Добавить нового пользователя</h5>
      </Card.Header>
      <Card.Body>
        {showSuccess && <Alert variant="success">Пользователь успешно добавлен!</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Имя</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Введите имя"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@mail.com"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Возраст</Form.Label>
            <Form.Control
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              placeholder="25"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Роль</Form.Label>
            <Form.Select name="role" value={formData.role} onChange={handleChange}>
              <option>Пользователь</option>
              <option>Редактор</option>
              <option>Администратор</option>
            </Form.Select>
          </Form.Group>
          
          <Button variant="primary" type="submit">
            Добавить пользователя
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FormExample;