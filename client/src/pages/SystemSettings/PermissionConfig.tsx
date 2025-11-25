import React from 'react';
import { Card, Tree, Row, Col, Alert } from 'antd';
import { permissionTreeData } from '../../mock/system';

const PermissionConfig: React.FC = () => {
    return (
        <div style={{ padding: 24 }}>
            <Card title="权限配置">
                <Alert
                    message="权限说明"
                    description="此处展示系统的功能权限树。实际开发中，权限通常由后端动态返回或在前端代码中定义，此处仅为展示。"
                    type="info"
                    showIcon
                    style={{ marginBottom: 24 }}
                />
                <Row>
                    <Col span={12}>
                        <Tree
                            treeData={permissionTreeData}
                            defaultExpandAll
                            selectable={false}
                            titleRender={(node) => (
                                <span>
                                    {node.title} <span style={{ color: '#999', fontSize: 12 }}>({node.key})</span>
                                </span>
                            )}
                        />
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default PermissionConfig;
