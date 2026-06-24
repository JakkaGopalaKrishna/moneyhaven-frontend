import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';

const AuthLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#141414] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthLayout;
