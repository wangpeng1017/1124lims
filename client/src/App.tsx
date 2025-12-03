import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

import DeviceInfo from './pages/DeviceManagement/DeviceInfo';
import MaintenancePlan from './pages/DeviceManagement/MaintenancePlan';
import RepairManagement from './pages/DeviceManagement/RepairManagement';
import CalibrationPlan from './pages/DeviceManagement/CalibrationPlan';
import EntrustmentOrder from './pages/Entrustment';
import EntrustmentContract from './pages/Entrustment/EntrustmentContract';
import ClientUnit from './pages/Entrustment/ClientUnit';
import EntrustmentFill from './pages/Entrustment/EntrustmentFill';
import EntrustmentConsultation from './pages/Entrustment/EntrustmentConsultation';
import QuotationManagement from './pages/Entrustment/QuotationManagement';
import Consumables from './pages/Consumables';
import EmployeeList from './pages/PersonnelManagement/EmployeeList';
import DepartmentInfo from './pages/PersonnelManagement/DepartmentInfo';
import StationInfo from './pages/PersonnelManagement/StationInfo';
import CapabilityValue from './pages/PersonnelManagement/CapabilityValue';
import CapabilityReview from './pages/PersonnelManagement/CapabilityReview';
import InspectionStandards from './pages/SystemSettings/BasicData/InspectionStandards';
import TestTemplateManagement from './pages/SystemSettings/BasicData/TestTemplateManagement';
import SampleRegistration from './pages/SampleManagement/SampleRegistration';
import SampleDetails from './pages/SampleManagement/SampleDetails';
import MySamples from './pages/SampleManagement/MySamples';
import OutsourceByOrder from './pages/OutsourcingManagement/OutsourceByOrder';
import OutsourceByParameter from './pages/OutsourcingManagement/OutsourceByParameter';
import OutsourceOrders from './pages/OutsourcingManagement/OutsourceOrders';
import AllTasks from './pages/TaskManagement/AllTasks';
import MyTasks from './pages/TaskManagement/MyTasks';
import DataEntry from './pages/TestManagement/DataEntry';
import TestReports from './pages/ReportManagement/TestReports';
import ClientReports from './pages/ReportManagement/ClientReports';
import ReportApproval from './pages/ReportManagement/ReportApproval';
import ReportRecords from './pages/ReportManagement/ReportRecords';
import ReportCategories from './pages/SystemSettings/BasicData/ReportCategories';
import Receivables from './pages/FinanceManagement/Receivables';
import PaymentRecords from './pages/FinanceManagement/PaymentRecords';
import InvoiceManagement from './pages/FinanceManagement/InvoiceManagement';
import ConsumableInfo from './pages/ConsumablesManagement/ConsumableInfo';
import StockTransactions from './pages/ConsumablesManagement/StockTransactions';

// 供应商管理
import SupplierInfo from './pages/SupplierManagement/SupplierInfo';

//统计报表
import StatisticsReport from './pages/StatisticsReport';
import EntrustmentStats from './pages/StatisticsReport/EntrustmentStats';
import SampleStats from './pages/StatisticsReport/SampleStats';
import TaskStats from './pages/StatisticsReport/TaskStats';
import ReportTemplates from './pages/ReportManagement/ReportTemplates';

import SystemDocuments from './pages/SystemDocuments';

// 系统设置
import SystemSettings from './pages/SystemSettings';
import UserManagement from './pages/SystemSettings/UserManagement';
import RoleManagement from './pages/SystemSettings/RoleManagement';
import PermissionConfig from './pages/SystemSettings/PermissionConfig';
import SupplierCategory from './pages/SupplierManagement/SupplierCategory';
import EvaluationTemplate from './pages/SupplierManagement/EvaluationTemplate';
import PerformanceEvaluation from './pages/SupplierManagement/PerformanceEvaluation';
import ApprovalCenter from './pages/ApprovalCenter';


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/fill/:entrustmentId" element={<EntrustmentFill />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/device-management/info" replace />} />
          <Route path="device-management">
            <Route path="info" element={<DeviceInfo />} />
            <Route path="maintenance" element={<MaintenancePlan />} />
            <Route path="repair" element={<RepairManagement />} />
            <Route path="calibration" element={<CalibrationPlan />} />
          </Route>

          <Route path="consumables" element={<Consumables />} />
          <Route path="entrustment">
            <Route path="consultation" element={<EntrustmentConsultation />} />
            <Route path="quotation" element={<QuotationManagement />} />
            <Route path="order" element={<EntrustmentOrder />} />
            <Route path="contract" element={<EntrustmentContract />} />
            <Route path="client" element={<ClientUnit />} />
          </Route>
          <Route path="personnel">
            <Route path="employee" element={<EmployeeList />} />
            <Route path="department" element={<DepartmentInfo />} />
            <Route path="station" element={<StationInfo />} />
          </Route>
          <Route path="basic-params">
            <Route path="test-templates" element={<TestTemplateManagement />} />
            <Route path="standards" element={<InspectionStandards />} />
            <Route path="qualification">
              <Route path="value" element={<CapabilityValue />} />
              <Route path="review" element={<CapabilityReview />} />
            </Route>
          </Route>
          <Route path="sample-management">
            <Route path="receipt" element={<SampleRegistration />} />
            <Route path="details" element={<SampleDetails />} />
            <Route path="my-samples" element={<MySamples />} />
          </Route>
          <Route path="task-management">
            <Route path="all-tasks" element={<AllTasks />} />
            <Route path="my-tasks" element={<MyTasks />} />
          </Route>
          <Route path="outsourcing-management">
            <Route path="supplier-info" element={<SupplierInfo />} />
            <Route path="outsource-by-order" element={<OutsourceByOrder />} />
            <Route path="outsource-by-parameter" element={<OutsourceByParameter />} />
            <Route path="outsource-orders" element={<OutsourceOrders />} />
          </Route>
          <Route path="test-management">
            <Route path="data-entry" element={<DataEntry />} />
          </Route>
          <Route path="report-management">
            <Route path="test-reports" element={<TestReports />} />
            <Route path="client-reports" element={<ClientReports />} />
            <Route path="approval" element={<ReportApproval />} />
            <Route path="records" element={<ReportRecords />} />
            <Route path="report-templates" element={<ReportTemplates />} />
            <Route path="categories" element={<ReportCategories />} />
          </Route>
          <Route path="finance-management">
            <Route path="receivables" element={<Receivables />} />
            <Route path="payment-records" element={<PaymentRecords />} />
            <Route path="invoices" element={<InvoiceManagement />} />
          </Route>
          <Route path="consumables-management">
            <Route path="info" element={<ConsumableInfo />} />
            <Route path="transactions" element={<StockTransactions />} />
          </Route>
          <Route path="statistics-report">
            <Route index element={<StatisticsReport />} />
            <Route path="entrustment" element={<EntrustmentStats />} />
            <Route path="sample" element={<SampleStats />} />
            <Route path="task" element={<TaskStats />} />
          </Route>
          <Route path="system-documents" element={<SystemDocuments />} />
          <Route path="system-settings">
            <Route index element={<SystemSettings />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="roles" element={<RoleManagement />} />
            <Route path="permission" element={<PermissionConfig />} />
          </Route>
          <Route path="supplier-management">
            {/* 供应商管理 */}
            <Route path="info" element={<SupplierInfo />} />
            <Route path="category" element={<SupplierCategory />} />
            <Route path="template" element={<EvaluationTemplate />} />
            <Route path="evaluation" element={<PerformanceEvaluation />} />
          </Route>
          <Route path="approval-center" element={<ApprovalCenter />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
