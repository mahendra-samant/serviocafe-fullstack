import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import CustomerDashboard from './components/Dashboard/CustomerDashboard';
import WaiterDashboard from './components/Dashboard/WaiterDashboard';
import ChefDashboard from './components/Dashboard/ChefDashboard';
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute"; // <-- added

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Customer Dashboard */}
        <Route
          path="/customer-dashboard"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Waiter Dashboard */}
        <Route
          path="/waiter-dashboard"
          element={
            <ProtectedRoute allowedRoles={["waiter"]}>
              <WaiterDashboard />
            </ProtectedRoute>
          }
        />

        {/* Chef Dashboard */}
        <Route
          path="/chef-dashboard"
          element={
            <ProtectedRoute allowedRoles={["chef"]}>
              <ChefDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
