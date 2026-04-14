import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';

function QwenGenerated() {
  const features = [
    { name: 'Анализ кода', status: 'Выполнено', color: 'success' },
    { name: 'Генерация компонентов', status: 'Выполнено', color: 'success' },
    { name: 'Оптимизация производительности', status: 'В процессе', color: 'warning' },
    { name: 'Рефакторинг', status: 'Запланировано', color: 'info' },
    { name: 'Тестирование', status: 'Запланировано', color: 'secondary' }
  ];

  const metrics = {
    linesOfCode: 1250,
    components: 6,
    apiEndpoints: 8,
    testCoverage: '78%'
  };

  return (
    <div className="qwen-generated">
      <h2 className="mb-4">🤖 Qwen Generated Content</h2>
      
      <Card className="mb-4">
        <Card.Header bg="primary" text="white">
          <Card.Title>Статистика проекта</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="row text-center">
            <div className="col-md-3">
              <h3>{metrics.linesOfCode}</h3>
              <p className="text-muted">Строк кода</p>
            </div>
            <div className="col-md-3">
              <h3>{metrics.components}</h3>
              <p className="text-muted">Компонентов</p>
            </div>
            <div className="col-md-3">
              <h3>{metrics.apiEndpoints}</h3>
              <p className="text-muted">API endpoints</p>
            </div>
            <div className="col-md-3">
              <h3>{metrics.testCoverage}</h3>
              <p className="text-muted">Покрытие тестами</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title>Состояние задач</Card.Title>
        </Card.Header>
        <ListGroup variant="flush">
          {features.map((feature, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
              {feature.name}
              <Badge bg={feature.color} pill>
                {feature.status}
              </Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>

      <Card className="mt-4">
        <Card.Body>
          <blockquote className="blockquote mb-0">
            <p>
              "Код должен быть написан так, чтобы его было легко читать не только машине, 
              но и другим разработчикам."
            </p>
            <footer className="blockquote-footer">
              Принципы <cite title="Source Title">Qwen AI</cite>
            </footer>
          </blockquote>
        </Card.Body>
      </Card>
    </div>
  );
}

export default QwenGenerated;
