import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './features/auth/authSlice';

// Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Procurement from './pages/Procurement';
import LogsRawMaterials from './pages/LogsRawMaterials';
import Inventory from './pages/Inventory';
import Sawmill from './pages/Sawmill';
import CuttingOptimizer from './pages/CuttingOptimizer';
import Production from './pages/Production';
import SalesCRM from './pages/SalesCRM';
import Export from './pages/Export';
import Finance from './pages/Finance';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import CutOptimizer from './pages/CutOptimizer';

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchMe());
    }
  }, [dispatch, token]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/procurement" element={<Procurement />} />
          <Route path="/logs" element={<LogsRawMaterials />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/sawmill" element={<Sawmill />} />
          <Route path="/optimizer" element={<CutOptimizer />} />
          {/*<Route path="/optimizer" element={<CuttingOptimizer />} />*/}
          <Route path="/production" element={<Production />} />
          <Route path="/sales" element={<SalesCRM />} />
          <Route path="/export" element={<Export />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
