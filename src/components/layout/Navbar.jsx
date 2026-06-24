import { Avatar, Dropdown, Button } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined, SunOutlined, MoonOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTES } from '../../constants/routes';
import useTheme from '../../hooks/useTheme';
import { logoutUser } from '../../store/authSlice';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate(ROUTES.LOGIN);
  };

  const userMenu = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate(ROUTES.PROFILE),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
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
    <header className="h-16 bg-white dark:bg-[#1f1f1f] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sticky top-0 z-10 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <button 
          className="md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          onClick={onMenuClick}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <div className="md:hidden font-bold text-xl text-[#1677ff] dark:text-blue-400">MoneyHaven</div>
      </div>

      <div className="flex items-center gap-4">
        <Button 
          type="text" 
          icon={isDarkMode ? <SunOutlined className="text-yellow-500" /> : <MoonOutlined />} 
          onClick={toggleTheme}
          className="dark:text-white"
        />
        
        {isAuthenticated ? (
          <Dropdown menu={{ items: userMenu }} placement="bottomRight" trigger={['click']}>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
              <Avatar src={user?.avatar} icon={!user?.avatar && <UserOutlined />} className="bg-blue-500" />
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
          </Dropdown>
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
