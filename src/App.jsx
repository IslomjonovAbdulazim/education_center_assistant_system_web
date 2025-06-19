import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ROLES } from './utils/constants';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AssistantDashboard from './pages/AssistantDashboard';
import StudentDashboard from './pages/StudentDashboard';
import './styles/globals.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Yuklanmoqda...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Yuklanmoqda...</div>;
  }

  if (!user) {
    return <Login />;
  }

  // Redirect based on user role
  const getDashboardByRole = () => {
    switch (user.role) {
      case ROLES.ADMIN:
        return <AdminDashboard />;
      case ROLES.MANAGER:
        return <ManagerDashboard />;
      case ROLES.ASSISTANT:
        return <AssistantDashboard />;
      case ROLES.STUDENT:
        return <StudentDashboard />;
      default:
        return <Navigate to="/" replace />;
    }
  };

  return (
    <Routes>
      <Route path="/" element={getDashboardByRole()} />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/manager" 
        element={
          <ProtectedRoute allowedRoles={[ROLES.MANAGER]}>
            <ManagerDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/assistant" 
        element={
          <ProtectedRoute allowedRoles={[ROLES.ASSISTANT]}>
            <AssistantDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student" 
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;