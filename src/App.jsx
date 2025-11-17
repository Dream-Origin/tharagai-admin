import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
// import OrdersPage from './pages/OrdersPage.jsx';
import Products from './pages/Products.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<h1>Dashboard Home</h1>} />
        <Route path="products" element={<Products />} />
        {/* <Route path="orders" element={<OrdersPage />} /> */}
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
