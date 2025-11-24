import React from 'react';
import { Table, Card, Tag, Statistic, Row, Col, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { consumablesData } from '../../mock/consumables';
import type { Consumable } from '../../mock/consumables';

const Consumables: React.FC = () => {
    const columns: ColumnsType<Consumable> = [
        {
            title: '物料编号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '规格型号',
            dataIndex: 'spec',
            key: 'spec',
        },
        {
            title: '单位',
            dataIndex: 'unit',
            key: 'unit',
        },
        {
            title: '库存',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock) => (
                <span style={{ color: stock <= 2 ? 'red' : 'inherit', fontWeight: stock <= 2 ? 'bold' : 'normal' }}>
                    {stock}
                </span>
            ),
            sorter: (a, b) => a.stock - b.stock,
        },
        {
            title: '库位',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: '类别',
            dataIndex: 'category',
            key: 'category',
            render: (text) => <Tag>{text}</Tag>,
        },
    ];

    return (
        <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card>
                        <Statistic title="总物料种类" value={consumablesData.length} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="库存预警"
                            value={consumablesData.filter(c => c.stock <= 2).length}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="易耗品库存管理" extra={<Button type="primary">入库/出库</Button>}>
                <Table
                    columns={columns}
                    dataSource={consumablesData}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    );
};

export default Consumables;
