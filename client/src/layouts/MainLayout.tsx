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
  getItem('方法管理', '/method', <FileOutlined />),
  getItem('环境管理', '/environment', <EnvironmentOutlined />),
  getItem('设备管理', '/device', <ToolOutlined />),
  getItem('委托信息', '/entrustment', <ExperimentOutlined />),
  getItem('易耗品管理', '/consumables', <ShopOutlined />),
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
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Title level={5} style={{ color: 'white', margin: 0, display: collapsed ? 'none' : 'block' }}>LIMS System</Title>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={[location.pathname]}
          selectedKeys={[location.pathname]}
          mode="inline"
          items={items}
          onClick={({ key }) => navigate(key.toString())}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 16px', background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Breadcrumb style={{ margin: '16px 0' }} items={[{ title: 'LIMS' }, { title: getCurrentTitle() }]} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Admin User</span>
            <Avatar icon={<UserOutlined />} />
          </div>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              marginTop: 16
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
