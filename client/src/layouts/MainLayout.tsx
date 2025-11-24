import React, { useState } from 'react';
import {
  FileOutlined,
  UserOutlined,
  ExperimentOutlined,
  EnvironmentOutlined,
  ToolOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Avatar, Typography } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('设备管理', '/device', <ToolOutlined />),
  getItem('环境管理', '/environment', <EnvironmentOutlined />),
  getItem('易耗品管理', '/consumables', <ShopOutlined />),
  getItem('方法管理', '/method', <FileOutlined />),
  getItem('委托信息', '/entrustment', <ExperimentOutlined />),
];

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentTitle = (): string => {
    const currentItem = items.find(i => i?.key === location.pathname);
    if (currentItem && 'label' in currentItem) {
      return currentItem.label as string;
    }
    return 'Home';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <div style={{ height: 32, margin: 16, background: '#e6f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}>
          <Title level={5} style={{ color: '#1890ff', margin: 0, display: collapsed ? 'none' : 'block' }}>LIMS系统</Title>
        </div>
        <Menu
          theme="light"
          defaultSelectedKeys={[location.pathname]}
          selectedKeys={[location.pathname]}
          mode="inline"
          items={items}
          onClick={({ key }) => navigate(key.toString())}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Header style={{
          padding: '0 16px',
          background: colorBgContainer,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)'
        }}>
          <Breadcrumb style={{ margin: '16px 0' }} items={[{ title: 'LIMS' }, { title: getCurrentTitle() }]} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Admin User</span>
            <Avatar icon={<UserOutlined />} />
          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          LIMS ©{new Date().getFullYear()} Created by Trae AI
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
