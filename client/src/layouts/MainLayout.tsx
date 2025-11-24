import React, { useState } from 'react';
import {
  UserOutlined,
  ExperimentOutlined,
  EnvironmentOutlined,
  ToolOutlined,
  ShopOutlined,
  TeamOutlined,
  ApartmentOutlined,
  SafetyCertificateOutlined,
  AuditOutlined,
  ProfileOutlined,
  ReadOutlined,
  FileProtectOutlined,
  DollarOutlined,
  FileTextOutlined,
  BarcodeOutlined,
  SwapOutlined,
  InboxOutlined,
  ProjectOutlined,
  PartitionOutlined,
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
  getItem('委托管理', '/entrustment', <ExperimentOutlined />, [
    getItem('委托单', '/entrustment/order', <FileProtectOutlined />),
    getItem('委托合同', '/entrustment/contract', <AuditOutlined />),
    getItem('委托单位', '/entrustment/client', <ApartmentOutlined />),
    getItem('委托样品', '/entrustment/sample', <ExperimentOutlined />),
  ]),
  getItem('人事管理', '/personnel', <TeamOutlined />, [
    getItem('员工列表', '/personnel/employee', <UserOutlined />),
    getItem('部门信息', '/personnel/department', <ApartmentOutlined />),
    getItem('站点信息', '/personnel/station', <EnvironmentOutlined />),
    getItem('能力值', '/personnel/capability', <SafetyCertificateOutlined />),
    getItem('能力评审', '/personnel/review', <AuditOutlined />),
  ]),
  getItem('检测基础参数', '/basic-params', <ProfileOutlined />, [
    getItem('电子试验记录本 (ELN)', '/basic-params/eln', <ReadOutlined />),
    getItem('检测参数/项目', '/basic-params/detection', <ExperimentOutlined />),
    getItem('检查标准/依据', '/basic-params/standards', <FileProtectOutlined />),
  ]),
  getItem('样品管理', '/sample-management', <ExperimentOutlined />, [
    getItem('收样/计价', '/sample-management/receipt', <DollarOutlined />),
    getItem('样品明细', '/sample-management/details', <FileTextOutlined />),
    getItem('样品标签', '/sample-management/labels', <BarcodeOutlined />),
    getItem('流转记录', '/sample-management/transfer', <SwapOutlined />),
    getItem('我的样品', '/sample-management/my-samples', <InboxOutlined />),
    getItem('任务分配（样品）', '/sample-management/task-sample', <ProjectOutlined />),
    getItem('任务分配（参数）', '/sample-management/task-parameter', <PartitionOutlined />),
  ]),
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
        <div style={{ height: 32, margin: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Title level={5} style={{ color: '#1890ff', margin: 0, display: collapsed ? 'none' : 'block' }}>LIMS系统</Title>
        </div>
        <Menu
          theme="light"
          defaultSelectedKeys={[location.pathname]}
          selectedKeys={[location.pathname]}
          mode="inline"
          items={items}
          onClick={({ key }) => navigate(key.toString())}
          style={{ marginBottom: 48 }}
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
          LIMS ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
