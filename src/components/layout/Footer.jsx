import { Outlet } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-[#1f1f1f] text-gray-500 dark:text-white py-4 text-center text-sm border-t border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="mx-4 mx-auto text-center md:text-left text-sm flex flex-col md:flex-row justify-between items-center">
        <p>© {new Date().getFullYear()} MoneyHaven. All rights reserved.</p>
        <p className="md:mt-0">Built with 💙 for personal finance.</p>
      </div>
    </footer>
  );
};

export default Footer;
