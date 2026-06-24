import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import SkeletonLoader from '../components/common/SkeletonLoader';

// Pages
const LandingPage = lazy(() => import('../pages/Landing'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Profile = lazy(() => import('../pages/Profile'));
const Transactions = lazy(() => import('../pages/Transactions'));
const Categories = lazy(() => import('../pages/Categories'));
const Budgets = lazy(() => import('../pages/Budgets'));
const Goals = lazy(() => import('../pages/Goals'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Reports = lazy(() => import('../pages/Reports'));
const ScheduledReports = lazy(() => import('../pages/ScheduledReports'));
const Notifications = lazy(() => import('../pages/Notifications/Notifications'));
const NotificationSettings = lazy(() => import('../pages/Notifications/NotificationSettings'));
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));

const AppRoutes = () => {
  return (
    <Router>
      <Suspense fallback={<div className="p-8 space-y-6"><SkeletonLoader type="stat" count={4} /><SkeletonLoader type="chart" /></div>}>
        <Routes>
          <Route path={ROUTES.HOME} element={<LandingPage />} />
          
          {/* Auth Routes */}
          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.REGISTER} element={<Register />} />
            </Route>
          </Route>

          {/* Main App Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.PROFILE} element={<Profile />} />
              <Route path={ROUTES.TRANSACTIONS} element={<Transactions />} />
              <Route path={ROUTES.CATEGORIES} element={<Categories />} />
              <Route path={ROUTES.BUDGETS} element={<Budgets />} />
              <Route path={ROUTES.GOALS} element={<Goals />} />
              <Route path={ROUTES.ANALYTICS} element={<Analytics />} />
              <Route path={ROUTES.REPORTS} element={<Reports />} />
              <Route path={ROUTES.SCHEDULES} element={<ScheduledReports />} />
              <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
              <Route path={ROUTES.NOTIFICATION_SETTINGS} element={<NotificationSettings />} />
            </Route>
          </Route>

          {/* Not Found Route */}
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
