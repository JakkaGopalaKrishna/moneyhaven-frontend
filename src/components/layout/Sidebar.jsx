import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ROUTES } from '../../constants/routes';
import { 
  AppstoreOutlined, 
  SwapOutlined, 
  TagsOutlined, 
  WalletOutlined, 
  FlagOutlined, 
  LineChartOutlined, 
  FileTextOutlined, 
  BellOutlined, 
  UserOutlined, 
  SettingOutlined, 
  LogoutOutlined 
} from '@ant-design/icons';
import { Avatar, Typography } from 'antd';
import { logoutUser } from '../../store/authSlice';
import { motion } from 'framer-motion';

const { Text } = Typography;

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate(ROUTES.LOGIN);
  };

  const navItems = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: <AppstoreOutlined /> },
    { label: 'Transactions', path: ROUTES.TRANSACTIONS, icon: <SwapOutlined /> },
    { label: 'Budgets', path: ROUTES.BUDGETS, icon: <WalletOutlined /> },
    { label: 'Goals', path: ROUTES.GOALS, icon: <FlagOutlined /> },
    { label: 'Analytics', path: ROUTES.ANALYTICS, icon: <LineChartOutlined /> },
    { label: 'Reports', path: ROUTES.REPORTS, icon: <FileTextOutlined /> },
    { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: <BellOutlined /> },
    { label: 'Profile', path: ROUTES.PROFILE, icon: <UserOutlined /> },
    { label: 'Settings', path: ROUTES.NOTIFICATION_SETTINGS, icon: <SettingOutlined /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white/90 dark:bg-fintech-surface/90 backdrop-blur-xl border-r border-gray-200 dark:border-fintech-border transition-colors duration-200 h-[calc(100vh-4rem)] fixed left-0 top-16 z-40">
      
      <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-1 scrollbar-hide">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-300 ${
                isActive
                  ? 'text-fintech-primary font-medium'
                  : 'text-gray-600 dark:text-fintech-textMuted hover:bg-gray-50 dark:hover:bg-fintech-bg/50 hover:text-gray-900 dark:hover:text-fintech-text'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveIndicator"
                    className="absolute inset-0 bg-blue-50 dark:bg-fintech-primary/10 rounded-xl"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="text-xl relative z-10">{item.icon}</span>
                <span className="relative z-10">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile at bottom */}
      <div className="p-4 border-t border-gray-200 dark:border-fintech-border">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar src={user?.avatar} icon={!user?.avatar && <UserOutlined />} className="bg-fintech-primary flex-shrink-0" />
          <div className="flex flex-col overflow-hidden">
            <Text className="text-sm font-semibold text-gray-900 dark:text-fintech-text truncate">
              {user?.firstName} {user?.lastName}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-fintech-textMuted truncate">
              {user?.email}
            </Text>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="mt-2 w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-fintech-danger hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-200 text-sm font-medium"
        >
          <LogoutOutlined className="text-lg" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
