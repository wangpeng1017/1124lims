import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import MethodManagement from './pages/MethodManagement';
import EnvironmentManagement from './pages/EnvironmentManagement';
import DeviceManagement from './pages/DeviceManagement';
import Entrustment from './pages/Entrustment';
import Consumables from './pages/Consumables';
import EmployeeList from './pages/PersonnelManagement/EmployeeList';
import DepartmentInfo from './pages/PersonnelManagement/DepartmentInfo';
import StationInfo from './pages/PersonnelManagement/StationInfo';
import CapabilityValue from './pages/PersonnelManagement/CapabilityValue';
import CapabilityReview from './pages/PersonnelManagement/CapabilityReview';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/device" replace />} />
          <Route path="device" element={<DeviceManagement />} />
          <Route path="environment" element={<EnvironmentManagement />} />
          <Route path="consumables" element={<Consumables />} />
          <Route path="method" element={<MethodManagement />} />
          <Route path="entrustment" element={<Entrustment />} />
          <Route path="personnel">
            <Route path="employee" element={<EmployeeList />} />
            <Route path="department" element={<DepartmentInfo />} />
            <Route path="station" element={<StationInfo />} />
            <Route path="capability" element={<CapabilityValue />} />
            <Route path="review" element={<CapabilityReview />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
