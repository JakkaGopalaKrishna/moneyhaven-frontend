import React, { useEffect } from 'react';
import { Avatar, Dropdown, Button, Badge, List, Typography, Input } from 'antd';
import { UserOutlined, LogoutOutlined, SunOutlined, MoonOutlined, LoginOutlined, UserAddOutlined, BellOutlined, SearchOutlined, InfoCircleOutlined, WarningOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTES } from '../../constants/routes';
import useTheme from '../../hooks/useTheme';
import { logoutUser } from '../../store/authSlice';
import { fetchNotifications, fetchUnreadCount, markAsRead } from '../../store/notificationSlice';
import { formatCurrency } from '../../utils/currencyFormatter';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Text } = Typography;

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDarkMode, toggleTheme } = useTheme();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { summary } = useSelector((state) => state.dashboard);
  const { notifications, unreadCount } = useSelector((state) => state.notifications);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUnreadCount());
      dispatch(fetchNotifications());

      const interval = setInterval(() => {
        dispatch(fetchUnreadCount());
        dispatch(fetchNotifications());
      }, 30000); // 30 seconds polling

      return () => clearInterval(interval);
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate(ROUTES.LOGIN);
  };

  const handleNotificationClick = (item) => {
    if (!item.isRead) dispatch(markAsRead(item._id));
    if (item.actionUrl) navigate(item.actionUrl);
  };

  const userMenu = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate(ROUTES.PROFILE),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="h-16 bg-white/90 dark:bg-fintech-surface/90 backdrop-blur-md border-b border-gray-200 dark:border-fintech-border flex items-center justify-between px-4 sticky top-0 z-40 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          onClick={onMenuClick}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <div className="hidden md:block font-bold text-2xl text-fintech-primary cursor-pointer" onClick={() => navigate(ROUTES.DASHBOARD)}>
          MoneyHaven
        </div>
        <div className="md:hidden font-bold text-xl text-fintech-primary">MoneyHaven</div>
        <div className="hidden md:flex items-center ml-4">
          <Input 
            prefix={<SearchOutlined className="text-gray-400" />} 
            placeholder="Search transactions..." 
            className="w-64 bg-gray-100 dark:bg-fintech-background border-transparent hover:border-fintech-border focus:border-fintech-primary dark:text-white rounded-full"
            variant="filled"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          type="text"
          icon={isDarkMode ? <SunOutlined className="text-yellow-500" /> : <MoonOutlined />}
          onClick={toggleTheme}
          className="dark:text-white"
        />

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Dropdown
              trigger={['click']}
              dropdownRender={() => (
                <div className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-lg w-80 border border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between items-center p-3 border-b border-gray-100 dark:border-gray-800">
                    <span className="font-semibold dark:text-white">Notifications</span>
                    <Button type="link" size="small" onClick={() => navigate(ROUTES.NOTIFICATIONS)}>View All</Button>
                  </div>
                  <List
                    itemLayout="horizontal"
                    dataSource={notifications.slice(0, 5)}
                    className="max-h-80 overflow-y-auto"
                    locale={{ emptyText: <div className="p-4 text-center text-gray-500">No new notifications</div> }}
                    renderItem={(item) => (
                      <List.Item
                        className={`px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-50 dark:border-gray-800 ${!item.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                        onClick={() => handleNotificationClick(item)}
                      >
                        <List.Item.Meta
                          title={
                            <div className="flex justify-between items-center w-full gap-2">
                              <div className="flex items-center gap-2">
                                {item.severity === 'critical' && <ExclamationCircleOutlined className="text-fintech-danger" />}
                                {item.severity === 'warning' && <WarningOutlined className="text-fintech-warning" />}
                                {item.severity === 'success' && <CheckCircleOutlined className="text-fintech-success" />}
                                {(!item.severity || item.severity === 'info') && <InfoCircleOutlined className="text-fintech-primary" />}
                                <span className={`text-sm ${!item.isRead ? 'font-semibold dark:text-white' : 'dark:text-gray-300'}`}>
                                  {item.title}
                                </span>
                              </div>
                            </div>
                          }
                          description={
                            <div className="flex flex-col mt-1">
                              <Text className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{item.message}</Text>
                              <Text className="text-[10px] text-gray-400 mt-1">{dayjs(item.createdAt).fromNow()}</Text>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </div>
              )}
            >
              <Badge count={unreadCount} overflowCount={99} size="small" offset={[-2, 6]}>
                <Button type="text" icon={<BellOutlined className="text-lg" />} className="dark:text-white" />
              </Badge>
            </Dropdown>

            <div className="hidden md:flex flex-col text-right border-l border-gray-200 dark:border-gray-800 pl-4">
              <span className="text-xs text-gray-500 dark:text-gray-400">Current Balance</span>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                {formatCurrency(summary?.currentBalance || user?.openingBalance)}
              </span>
            </div>
            <Dropdown menu={{ items: userMenu }} placement="bottomRight" trigger={['click']}>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
                <Avatar src={user?.avatar || undefined} icon={!user?.avatar && <UserOutlined />} className="bg-blue-500" />
                <span className="hidden sm:flex items-center text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
            </Dropdown>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to={ROUTES.LOGIN}>
              <Button type="text" icon={<LoginOutlined />} className="dark:text-white hidden sm:flex">
                Login
              </Button>
            </Link>
            <Link to={ROUTES.REGISTER}>
              <Button type="primary" icon={<UserAddOutlined />}>
                Register
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
