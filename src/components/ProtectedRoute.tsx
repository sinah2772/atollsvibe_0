import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'editor' | string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // You could render a loading spinner here
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ returnTo: location.pathname }} replace />;
  }

  // Check for required role if specified
  if (requiredRole) {
    // For admin role check
    if (requiredRole === 'admin' && !user.is_admin) {
      return <Navigate to="/dashboard" replace />;
    }

    // For other role checks, you could expand this to check user.role_id or other properties
    // if (requiredRole === 'editor' && user.user_type !== 'editor') {
    //   return <Navigate to="/dashboard" replace />;
    // }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
