import { Drawer } from 'antd';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { 
  AppstoreOutlined, 
  SwapOutlined, 
  WalletOutlined, 
  FlagOutlined, 
  LineChartOutlined, 
  FileTextOutlined, 
  BellOutlined, 
  UserOutlined, 
  SettingOutlined 
} from '@ant-design/icons';

const MobileDrawer = ({ open, onClose }) => {
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
    <Drawer
      title={<span className="text-[#1677ff] dark:text-blue-400 font-bold text-xl">MoneyHaven</span>}
      placement="left"
      onClose={onClose}
      open={open}
      className="md:hidden"
      styles={{
        body: { padding: 0 },
        header: { borderBottom: '1px solid #e5e7eb' },
      }}
    >
      <nav className="flex-grow py-4 px-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </Drawer>
  );
};

export default MobileDrawer;
