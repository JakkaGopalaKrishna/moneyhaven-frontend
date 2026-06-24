import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import MobileDrawer from '../components/layout/MobileDrawer';

const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#141414] transition-colors duration-200">
      <Sidebar />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      
      <div className="md:ml-64 flex flex-col min-h-screen">
        <Navbar onMenuClick={() => setDrawerOpen(true)} />
        
        <main className="flex-grow p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
