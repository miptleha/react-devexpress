import React, { useState } from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import DataGrid, { Column, Editing, Paging, Sorting, FilterRow, SearchPanel } from 'devextreme-react/data-grid';

const CustomDataGrid = ({ dataSource, columns, title, onUpdate, onDelete, onAdd, readOnly = false }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({});

  const handleEdit = (e) => {
    const row = e.row.data;
    setEditingRow(row);
    setFormData(row);
    setShowModal(true);
  };

  const handleDelete = (e) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      onDelete(e.row.data.id);
    }
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editingRow.id, formData);
    }
    setShowModal(false);
    setEditingRow(null);
  };

  const handleAdd = () => {
    setEditingRow(null);
    setFormData({});
    setShowModal(true);
  };

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddSave = () => {
    if (onAdd) {
      onAdd(formData);
    }
    setShowModal(false);
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{title}</h5>
        {!readOnly && (
          <Button variant="primary" size="sm" onClick={handleAdd}>
            + Добавить
          </Button>
        )}
      </Card.Header>
      <Card.Body>
        <DataGrid
          dataSource={dataSource}
          keyExpr="id"
          showBorders={true}
          allowColumnReordering={true}
          allowColumnResizing={true}
          columnAutoWidth={true}
        >
          <Paging defaultPageSize={10} />
          <Sorting mode="multiple" />
          <FilterRow visible={true} />
          <SearchPanel visible={true} width={240} placeholder="Поиск..." />
          
          {columns.map((col, idx) => (
            <Column key={idx} {...col} />
          ))}
          
          {!readOnly && (
            <Editing mode="popup" allowUpdating={true} allowDeleting={true}>
              <Column type="buttons">
                <Button name="edit" icon="edit" onClick={handleEdit} />
                <Button name="delete" icon="trash" onClick={handleDelete} />
              </Column>
            </Editing>
          )}
        </DataGrid>
      </Card.Body>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingRow ? 'Редактировать' : 'Добавить'} запись</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {columns.map((col, idx) => {
              if (col.dataField === 'id') return null;
              return (
                <Form.Group key={idx} className="mb-3">
                  <Form.Label>{col.caption}</Form.Label>
                  <Form.Control
                    type={col.dataType === 'number' ? 'number' : 'text'}
                    value={formData[col.dataField] || ''}
                    onChange={(e) => handleFormChange(col.dataField, e.target.value)}
                  />
                </Form.Group>
              );
            })}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Отмена
          </Button>
          <Button variant="primary" onClick={editingRow ? handleSave : handleAddSave}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default CustomDataGrid;