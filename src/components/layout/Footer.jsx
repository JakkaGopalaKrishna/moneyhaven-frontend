import { Outlet } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-[#1f1f1f] text-gray-500 dark:text-gray-400 py-4 text-center text-sm border-t border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <p>&copy; {new Date().getFullYear()} MoneyHaven. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
