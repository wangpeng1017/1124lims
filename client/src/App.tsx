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
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
