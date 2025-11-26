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
  TeamOutlined as SupplierOutlined,
  CheckCircleOutlined,
  FileSearchOutlined,
  FormOutlined,
  FileDoneOutlined,
  HistoryOutlined,
  HistoryOutlined as ReportAuditOutlined,
  FolderOutlined,
  AccountBookOutlined,
  TransactionOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
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
  getItem('委托管理', '/entrustment', <ExperimentOutlined />, [
    getItem('委托合同', '/entrustment/contract', <AuditOutlined />),
    getItem('委托单', '/entrustment/order', <FileProtectOutlined />),
    getItem('委托单位', '/entrustment/client', <ApartmentOutlined />),
    getItem('委托样品', '/entrustment/sample', <ExperimentOutlined />),
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
  getItem('试验管理', '/test-management', <ExperimentOutlined />, [
    getItem('检测任务', '/test-management/tasks', <CheckCircleOutlined />),
    getItem('我的任务', '/test-management/my-tasks', <UserOutlined />),
    getItem('数据录入', '/test-management/data-entry', <FormOutlined />),
    getItem('任务明细', '/test-management/task-details/TASK20231101001', <FileSearchOutlined />), // 示例链接
  ]),
  getItem('报告管理', '/report-management', <FileDoneOutlined />, [
    getItem('样品检测报告', '/report-management/test-reports', <FileTextOutlined />),
    getItem('报告审核/批准', '/report-management/review', <ReportAuditOutlined />),
    getItem('审核记录', '/report-management/review-records', <HistoryOutlined />),
    getItem('原始记录（委托单）', '/report-management/raw-records', <FolderOutlined />),
    getItem('报告模板管理', '/report-management/report-templates', <FileTextOutlined />),
    getItem('报告分类', '/report-management/categories', <AppstoreOutlined />),
  ]),
  getItem('设备管理', '/device-management', <ToolOutlined />, [
    getItem('设备档案', '/device-management/info', <ProfileOutlined />),
    getItem('设备保养', '/device-management/maintenance', <SafetyCertificateOutlined />),
    getItem('设备检修', '/device-management/repair', <ToolOutlined />),
    getItem('仪器定检', '/device-management/calibration', <AuditOutlined />),
  ]),
  getItem('耗材管理', '/consumables-management', <ShopOutlined />, [
    getItem('耗材信息', '/consumables-management/info', <ProfileOutlined />),
    getItem('出入库管理', '/consumables-management/transactions', <SwapOutlined />),
  ]),
  getItem('人事管理', '/personnel', <TeamOutlined />, [
    getItem('员工列表', '/personnel/employee', <UserOutlined />),
    getItem('部门信息', '/personnel/department', <ApartmentOutlined />),
    getItem('站点信息', '/personnel/station', <EnvironmentOutlined />),
    getItem('能力值', '/personnel/capability', <SafetyCertificateOutlined />),
    getItem('能力评审', '/personnel/review', <AuditOutlined />),
  ]),
  getItem('委外/分包管理', '/outsourcing-management', <SupplierOutlined />, [
    getItem('委外分配（委托单）', '/outsourcing-management/outsource-by-order', <FileProtectOutlined />),
    getItem('委外分配（参数）', '/outsourcing-management/outsource-by-parameter', <PartitionOutlined />),
    getItem('委外单信息', '/outsourcing-management/outsource-orders', <FileSearchOutlined />),
    getItem('委外任务完成', '/outsourcing-management/outsource-completion', <CheckCircleOutlined />),
  ]),
  getItem('供应商管理', '/supplier-management', <ApartmentOutlined />, [
    getItem('供应商分类', '/supplier-management/category', <AppstoreOutlined />),
    getItem('供应商信息', '/supplier-management/info', <ProfileOutlined />),
    getItem('评价模板', '/supplier-management/template', <FormOutlined />),
    getItem('绩效评价', '/supplier-management/evaluation', <AuditOutlined />),
    getItem('统计分析', '/supplier-management/statistics', <AppstoreOutlined />),
  ]),
  getItem('财务管理', '/finance-management', <AccountBookOutlined />, [
    getItem('委托应收', '/finance-management/receivables', <DollarOutlined />),
    getItem('收款记录', '/finance-management/payment-records', <TransactionOutlined />),
    getItem('开票管理', '/finance-management/invoices', <FileProtectOutlined />),
  ]),
  getItem('统计报表', '/statistics-report', <BarChartOutlined />, [
    getItem('委托单统计', '/statistics-report/entrustment', <FileTextOutlined />),
    getItem('样品统计', '/statistics-report/sample', <ExperimentOutlined />),
    getItem('任务完成率', '/statistics-report/task', <CheckCircleOutlined />),
  ]),
  getItem('基础数据配置', '/basic-params', <ProfileOutlined />, [
    getItem('电子试验记录本 (ELN)', '/basic-params/eln', <ReadOutlined />),
    getItem('检测参数/项目', '/basic-params/detection', <ExperimentOutlined />),
    getItem('检查标准/依据', '/basic-params/standards', <FileProtectOutlined />),
    getItem('样品报告分类', '/report-management/categories', <AppstoreOutlined />),
    getItem('环境管理', '/environment', <EnvironmentOutlined />),
  ]),
  getItem('系统设置', '/system-settings', <SettingOutlined />, [
    getItem('用户管理', '/system-settings/users', <UserOutlined />),
    getItem('角色管理', '/system-settings/roles', <TeamOutlined />),
    getItem('权限配置', '/system-settings/permission', <SafetyCertificateOutlined />),
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
    // Helper function to recursively find the label for the current path
    const findLabel = (items: MenuItem[] | undefined, path: string): string | undefined => {
      if (!items) return undefined;
      for (const item of items) {
        if (item && 'key' in item && item.key === path) {
          // Type guard to ensure we have a label
          if ('label' in item && item.label) {
            return item.label as string;
          }
        }
        if (item && 'children' in item && item.children) {
          const childLabel = findLabel(item.children as MenuItem[], path);
          if (childLabel) return childLabel;
        }
      }
      return undefined;
    };

    const title = findLabel(items, location.pathname);
    return title || 'Home';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
              style: { fontSize: '18px', marginRight: 16, cursor: 'pointer' }
            })}
            <Breadcrumb style={{ margin: '16px 0' }} items={[{ title: 'LIMS' }, { title: getCurrentTitle() }]} />
          </div>
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
