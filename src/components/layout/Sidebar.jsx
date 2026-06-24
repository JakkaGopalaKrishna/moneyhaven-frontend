import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: '📊' },
    { label: 'Profile', path: ROUTES.PROFILE, icon: '👤' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#1f1f1f] border-r border-gray-200 dark:border-gray-800 transition-colors duration-200 h-full fixed left-0 top-0 z-20">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
        <h1 className="text-xl font-bold text-[#1677ff] dark:text-blue-400">MoneyHaven</h1>
      </div>
      <nav className="flex-grow py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
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
    </aside>
  );
};

export default Sidebar;
