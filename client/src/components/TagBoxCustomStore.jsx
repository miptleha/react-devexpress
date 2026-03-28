import React, { useState, useMemo, useEffect } from 'react';
import { Card, Badge, Table } from 'react-bootstrap';
import Spinner from "react-bootstrap/esm/Spinner";
import TagBox from 'devextreme-react/tag-box';
import CustomStore from 'devextreme/data/custom_store';

const TagBoxCustomStore = () => {
    const [selected, setSelected] = useState([10, 20, 30]);
    const [selectedDetails, setSelectedDetails] = useState([]);
    const [callLog, setCallLog] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const addLog = (type, params, result = null) => {
        const logEntry = {
            time: new Date().toLocaleTimeString(),
            type,
            params: typeof params === 'object' ? JSON.parse(JSON.stringify(params)) : params,
            result: result ? (typeof result === 'object' ? JSON.parse(JSON.stringify(result)) : result) : null
        };
        setCallLog(prev => [logEntry, ...prev].slice(0, 10));
    };

    const loadSelectedDetails = async (selectedIds) => {
        if (!selectedIds || selectedIds.length === 0) {
            setSelectedDetails([]);
            return;
        }

        try {
            const items = await Promise.all(
                selectedIds.map(id =>
                    fetch(`/api/dataservice/${id}`)
                        .then(res => res.json())
                        .catch(error => {
                            console.error(`Ошибка загрузки элемента ${id}:`, error);
                            return null;
                        })
                )
            );
            setSelectedDetails(items.filter(i => i !== null));
        } catch (error) {
            console.error('Ошибка при загрузке деталей:', error);
        }
    };

    // Загружаем детали для начальных значений при монтировании компонента
    useEffect(() => {
        console.log('📦 Загрузка деталей для начальных значений:', selected);
        loadSelectedDetails(selected);
    }, []); // Пустой массив зависимостей - выполнится только при монтировании

    // Используем useMemo чтобы store создавался один раз и не пересоздавался при каждом рендере
    const store = useMemo(() => {
        console.log('🏗️ Создание CustomStore (один раз)');

        const cache = {};

        return new CustomStore({
            key: 'ID',

            load: (loadOptions) => {
                console.log('📤 load вызван:', loadOptions);
                addLog('load', loadOptions);

                const params = new URLSearchParams();

                if (loadOptions.filter) {
                    let result = [];
                    let notFound = false;
                    for (let i = 0; i < loadOptions.filter.length; i += 2) {
                        let id = loadOptions.filter[i][2];
                        if (!cache[id]) {
                            notFound = true;
                            break;
                        }
                        result.push(cache[id]);
                    }
                    console.log('В кэше найдено:', result.length, 'элементов, есть ли не найденные:', notFound)
                    if (!notFound) {
                        return Promise.resolve({
                            data: result,
                            totalCount: result.length
                        });
                    }

                    params.append('filter', JSON.stringify(loadOptions.filter));
                    console.log('📤 Отправляем filter:', JSON.stringify(loadOptions.filter));
                }

                if (loadOptions.take) params.append('take', loadOptions.take);
                if (loadOptions.skip) params.append('skip', loadOptions.skip);
                if (loadOptions.searchValue) {
                    setIsLoading(true);
                    params.append('searchValue', loadOptions.searchValue);
                }

                params.append('searchExpr', JSON.stringify(['FullName', 'Email']));
                params.append('requireTotalCount', 'true');

                const url = `/api/dataservice?${params.toString()}`;
                console.log('🌐 URL:', url);

                return fetch(url)
                    .then(res => res.json())
                    .then(data => {
                        for (let i = 0; i < data.data.length; i++) {
                            cache[data.data[i]["ID"]] = data.data[i];
                        }
                        console.log('📥 Получено:', data.data.length, 'записей, всего:', data.totalCount, 'размер кэша:' + Object.keys(cache).length);
                        addLog('load response', loadOptions, { count: data.data.length, total: data.totalCount });
                        return {
                            data: data.data,
                            totalCount: data.totalCount
                        };
                    })
                    .catch(error => {
                        console.error('❌ Ошибка:', error);
                        addLog('load error', loadOptions, error.message);
                        return { data: [], totalCount: 0 };
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            }
        });
    }, []); // Пустой массив зависимостей = создается один раз

    const handleValueChanged = (e) => {
        console.log('✅ Выбраны ID:', e.value);
        const newSelected = e.value || [];
        setSelected(newSelected);

        loadSelectedDetails(newSelected);
    };

    return (
        <div>
            <Card className="mb-4">
                <Card.Header>
                    <strong>🏷️ TagBox с CustomStore</strong>
                    <Badge bg="info" className="ms-2">
                        Выбрано: {selected.length}
                    </Badge>
                    {isLoading ? (<Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="ms-2"
                    />) : (<></>)}
                </Card.Header>
                <Card.Body>
                    <TagBox
                        dataSource={store}
                        valueExpr="ID"
                        displayExpr="FullName"
                        value={selected}
                        onValueChanged={handleValueChanged}
                        searchEnabled={true}
                        searchMode="contains"
                        placeholder="Введите имя или email..."
                        showClearButton={true}
                        showSelectionControls={true}
                        maxDisplayedTags={5}
                        width="100%"
                    /* не работает вместе с showSelectionControls, а до внутренней крутилки не знаю как добраться, поместил крутилку рядом лейблом
                    itemRender={(item, itemIndex) => {
                        if (isLoading) {
                            if (itemIndex === 0)
                                return (<div style={{ textAlign: 'center' }}>Загрузка...</div>);
                            return (<div></div>);
                        }
                        return (<div>{item.FullName}</div>);
                    }*/
                    />

                    <div className="mt-3 small text-muted">
                        💡 Попробуйте:
                        <ul className="mb-0 mt-1">
                            <li>Введите "Александр" — увидите список</li>
                            <li>Кликните на любой элемент в выпадающем списке</li>
                            <li>Выбранный элемент добавится в поле</li>
                            <li>Смотрите лог вызовов внизу</li>
                        </ul>
                    </div>
                </Card.Body>
            </Card>

            {/* Выбранные сотрудники */}
            {selectedDetails.length > 0 && (
                <Card className="mb-4">
                    <Card.Header>✅ Выбранные сотрудники</Card.Header>
                    <Card.Body className="p-0">
                        <Table striped bordered hover size="sm" className="mb-0">
                            <thead>
                                <tr><th>ID</th><th>ФИО</th><th>Email</th><th>Отдел</th><th>Должность</th></tr>
                            </thead>
                            <tbody>
                                {selectedDetails.map(emp => (
                                    <tr key={emp.ID}>
                                        <td>{emp.ID}</td>
                                        <td><strong>{emp.FullName}</strong></td>
                                        <td>{emp.Email}</td>
                                        <td>{emp.Department}</td>
                                        <td>{emp.Position}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}

            {/* Лог вызовов */}
            <Card>
                <Card.Header>
                    <strong>📋 Лог вызовов CustomStore (последние 10)</strong>
                </Card.Header>
                <Card.Body className="p-0">
                    <Table striped bordered hover size="sm" className="mb-0">
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>Время</th>
                                <th style={{ width: '100px' }}>Метод</th>
                                <th>Параметры</th>
                                <th>Результат</th>
                            </tr>
                        </thead>
                        <tbody>
                            {callLog.map((log, idx) => (
                                <tr key={idx}>
                                    <td className="small">{log.time}</td>
                                    <td>
                                        <Badge bg={log.type.includes('response') ? 'success' : (log.type.includes('error') ? 'danger' : 'primary')}>
                                            {log.type}
                                        </Badge>
                                    </td>
                                    <td className="small">
                                        <pre className="mb-0" style={{ fontSize: '10px', whiteSpace: 'pre-wrap' }}>
                                            {JSON.stringify(log.params, null, 2)}
                                        </pre>
                                    </td>
                                    <td className="small">
                                        {log.result && (
                                            <pre className="mb-0" style={{ fontSize: '10px', whiteSpace: 'pre-wrap' }}>
                                                {JSON.stringify(log.result, null, 2)}
                                            </pre>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {callLog.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted py-3">
                                        Начните вводить текст или выбирать элементы...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
};

export default TagBoxCustomStore;