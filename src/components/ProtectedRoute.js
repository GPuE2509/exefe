import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const location = useLocation();
  
  // Kiểm tra xem user có đăng nhập không
  if (!authService.isAuthenticated()) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Kiểm tra quyền admin nếu cần
  if (requireAdmin && !authService.isAdmin()) {
    // Redirect to home page if not admin
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
