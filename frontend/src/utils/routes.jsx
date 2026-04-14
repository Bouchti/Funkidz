import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import api from '../api/axios';

const normalizeRole = (role) => (typeof role === 'string' ? role.trim().toUpperCase() : '');

const useAuthBootstrap = () => {
  const { isAuthenticated, user, updateUser, logout } = useAuthStore();
  const [isBootstrapping, setIsBootstrapping] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    const hydrateUser = async () => {
      if (!isAuthenticated || user) return;
      setIsBootstrapping(true);
      try {
        const response = await api.get('/auth/me/');
        if (active) updateUser(response.data);
      } catch {
        if (active) logout();
      } finally {
        if (active) setIsBootstrapping(false);
      }
    };
    hydrateUser();
    return () => {
      active = false;
    };
  }, [isAuthenticated, user, updateUser, logout]);

  return { isAuthenticated, user, isBootstrapping };
};

export const PrivateRoute = () => {
  const { isAuthenticated, user, isBootstrapping } = useAuthBootstrap();
  if (isAuthenticated && !user && isBootstrapping) return null;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export const AdminRoute = () => {
  const { isAuthenticated, user, isBootstrapping } = useAuthBootstrap();
  if (isAuthenticated && !user && isBootstrapping) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return normalizeRole(user?.role) === 'ADMIN' ? <Outlet /> : <Navigate to="/" replace />;
};

export const AnimateurRoute = () => {
  const { isAuthenticated, user, isBootstrapping } = useAuthBootstrap();
  if (isAuthenticated && !user && isBootstrapping) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return normalizeRole(user?.role) === 'ANIMATEUR' ? <Outlet /> : <Navigate to="/" replace />;
};
