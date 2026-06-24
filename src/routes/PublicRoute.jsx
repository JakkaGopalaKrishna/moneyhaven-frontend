import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import useAuth from '../hooks/useAuth';

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
