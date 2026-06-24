import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/layout/Footer';

// Placeholders for components that will be built in subsequent commits
const SidebarPlaceholder = () => (
  <div className="hidden md:flex w-64 flex-col bg-white dark:bg-[#1f1f1f] border-r border-gray-200 dark:border-gray-800 transition-colors duration-200 h-full fixed left-0 top-0 z-20" />
);

const NavbarPlaceholder = ({ onMenuClick }) => (
  <header className="h-16 bg-white dark:bg-[#1f1f1f] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sticky top-0 z-10 transition-colors duration-200">
    <div className="flex items-center gap-4">
      <button className="md:hidden" onClick={onMenuClick}>
        <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>
      <div className="md:hidden font-bold text-xl dark:text-white">MoneyHaven</div>
    </div>
  </header>
);

const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#141414] transition-colors duration-200">
      <SidebarPlaceholder />
      
      <div className="md:ml-64 flex flex-col min-h-screen">
        <NavbarPlaceholder onMenuClick={() => setDrawerOpen(true)} />
        
        <main className="flex-grow p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
