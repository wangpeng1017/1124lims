import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import EnvironmentManagement from './pages/EnvironmentManagement';
import DeviceManagement from './pages/DeviceManagement';
import EntrustmentOrder from './pages/Entrustment';
import EntrustmentContract from './pages/Entrustment/EntrustmentContract';
import ClientUnit from './pages/Entrustment/ClientUnit';
import EntrustmentSample from './pages/Entrustment/EntrustmentSample';
import Consumables from './pages/Consumables';
import EmployeeList from './pages/PersonnelManagement/EmployeeList';
import DepartmentInfo from './pages/PersonnelManagement/DepartmentInfo';
import StationInfo from './pages/PersonnelManagement/StationInfo';
import CapabilityValue from './pages/PersonnelManagement/CapabilityValue';
import CapabilityReview from './pages/PersonnelManagement/CapabilityReview';
import InspectionStandards from './pages/BasicParameters/InspectionStandards';
import DetectionParameters from './pages/BasicParameters/DetectionParameters';
import ELN from './pages/BasicParameters/ELN';
import SampleReceipt from './pages/SampleManagement/SampleReceipt';
import SampleDetails from './pages/SampleManagement/SampleDetails';
import SampleLabels from './pages/SampleManagement/SampleLabels';
import TransferRecords from './pages/SampleManagement/TransferRecords';
import MySamples from './pages/SampleManagement/MySamples';
import SampleTaskAssignment from './pages/SampleManagement/SampleTaskAssignment';
import ParameterTaskAssignment from './pages/SampleManagement/ParameterTaskAssignment';
import SupplierInfo from './pages/OutsourcingManagement/SupplierInfo';
import SupplierCapability from './pages/OutsourcingManagement/SupplierCapability';
import OutsourceByOrder from './pages/OutsourcingManagement/OutsourceByOrder';
import OutsourceByParameter from './pages/OutsourcingManagement/OutsourceByParameter';
import OutsourceOrders from './pages/OutsourcingManagement/OutsourceOrders';
import OutsourceCompletion from './pages/OutsourcingManagement/OutsourceCompletion';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/device" replace />} />
          <Route path="device" element={<DeviceManagement />} />
          <Route path="environment" element={<EnvironmentManagement />} />
          <Route path="consumables" element={<Consumables />} />
          <Route path="entrustment">
            <Route path="order" element={<EntrustmentOrder />} />
            <Route path="contract" element={<EntrustmentContract />} />
            <Route path="client" element={<ClientUnit />} />
            <Route path="sample" element={<EntrustmentSample />} />
          </Route>
          <Route path="personnel">
            <Route path="employee" element={<EmployeeList />} />
            <Route path="department" element={<DepartmentInfo />} />
            <Route path="station" element={<StationInfo />} />
            <Route path="capability" element={<CapabilityValue />} />
            <Route path="review" element={<CapabilityReview />} />
          </Route>
          <Route path="basic-params">
            <Route path="eln" element={<ELN />} />
            <Route path="detection" element={<DetectionParameters />} />
            <Route path="standards" element={<InspectionStandards />} />
          </Route>
          <Route path="sample-management">
            <Route path="receipt" element={<SampleReceipt />} />
            <Route path="details" element={<SampleDetails />} />
            <Route path="labels" element={<SampleLabels />} />
            <Route path="transfer" element={<TransferRecords />} />
            <Route path="my-samples" element={<MySamples />} />
            <Route path="task-sample" element={<SampleTaskAssignment />} />
            <Route path="task-parameter" element={<ParameterTaskAssignment />} />
          </Route>
          <Route path="outsourcing-management">
            <Route path="supplier-info" element={<SupplierInfo />} />
            <Route path="supplier-capability" element={<SupplierCapability />} />
            <Route path="outsource-by-order" element={<OutsourceByOrder />} />
            <Route path="outsource-by-parameter" element={<OutsourceByParameter />} />
            <Route path="outsource-orders" element={<OutsourceOrders />} />
            <Route path="outsource-completion" element={<OutsourceCompletion />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
