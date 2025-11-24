import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import MethodManagement from './pages/MethodManagement';
import EnvironmentManagement from './pages/EnvironmentManagement';
import DeviceManagement from './pages/DeviceManagement';
import Entrustment from './pages/Entrustment';
import Consumables from './pages/Consumables';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/device" replace />} />
          <Route path="method" element={<MethodManagement />} />
          <Route path="environment" element={<EnvironmentManagement />} />
          <Route path="device" element={<DeviceManagement />} />
          <Route path="entrustment" element={<Entrustment />} />
          <Route path="consumables" element={<Consumables />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
