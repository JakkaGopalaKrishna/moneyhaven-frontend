import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import MobileDrawer from '../components/layout/MobileDrawer';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import PageTransition from '../components/common/PageTransition';

const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-fintech-bg transition-colors duration-200">
      <Sidebar />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      
      <div className="md:ml-64 flex flex-col min-h-screen">
        <Navbar onMenuClick={() => setDrawerOpen(true)} />
        
        <main className="flex-grow p-4 md:p-6 lg:p-8 pb-20 md:pb-8 w-full max-w-[1800px] mx-auto">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
        
        <Footer />
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default MainLayout;
