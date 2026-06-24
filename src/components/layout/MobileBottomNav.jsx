import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { 
  AppstoreOutlined, 
  SwapOutlined, 
  WalletOutlined, 
  FlagOutlined, 
  UserOutlined 
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const MobileBottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: ROUTES.DASHBOARD, icon: <AppstoreOutlined />, label: 'Home' },
    { path: ROUTES.TRANSACTIONS, icon: <SwapOutlined />, label: 'Transact' },
    { path: ROUTES.BUDGETS, icon: <WalletOutlined />, label: 'Budgets' },
    { path: ROUTES.GOALS, icon: <FlagOutlined />, label: 'Goals' },
    { path: ROUTES.PROFILE, icon: <UserOutlined />, label: 'Profile' }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#111827]/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 z-50 px-2 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center w-full h-full relative"
            >
              <div className={`text-xl mb-1 transition-colors ${isActive ? 'text-blue-500 dark:text-fintech-primary' : 'text-gray-500 dark:text-gray-400'}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-blue-500 dark:text-fintech-primary' : 'text-gray-500 dark:text-gray-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="bottomNavIndicator"
                  className="absolute -top-[1px] w-8 h-1 bg-blue-500 dark:bg-fintech-primary rounded-b-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
