import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Placeholder components for routing test
const Placeholder = ({ title }) => (
  <div className="p-8 flex items-center justify-center min-h-full">
    <h1 className="text-3xl font-bold dark:text-white transition-colors duration-200">{title} Page</h1>
  </div>
);

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<Placeholder title="Login" />} />
          <Route path={ROUTES.REGISTER} element={<Placeholder title="Register" />} />
        </Route>

        {/* Main App Routes */}
        <Route element={<MainLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<Placeholder title="Dashboard" />} />
          <Route path={ROUTES.PROFILE} element={<Placeholder title="Profile" />} />
        </Route>

        {/* Not Found Route */}
        <Route path={ROUTES.NOT_FOUND} element={<Placeholder title="Not Found" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
