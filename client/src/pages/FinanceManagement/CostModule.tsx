import React from 'react';
import { Card, Result } from 'antd';
import { ToolOutlined } from '@ant-design/icons';

const CostModule: React.FC = () => {
    return (
        <Card bordered={false}>
            <Result
                icon={<ToolOutlined style={{ fontSize: 64, color: '#1890ff' }} />}
                title="成本管理模块"
                subTitle="该功能正在开发中，敬请期待..."
                status="info"
            />
        </Card>
    );
};

export default CostModule;
