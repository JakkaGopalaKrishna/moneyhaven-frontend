import { Outlet, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import PageTransition from '../components/common/PageTransition';
import { ROUTES } from '../constants/routes';
import useTheme from '../hooks/useTheme';

const AuthLayout = () => {
  const location = useLocation();
  const { isDarkMode } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-fintech-bg flex">
      {/* Left Column: Form Container */}
      <div className="w-full lg:w-1/2 flex flex-col relative px-4 sm:px-8 lg:px-16 xl:px-24">
        
        {/* Back to Home Navigation */}
        <div className="absolute top-6 left-6 lg:top-8 lg:left-8 z-10">
          <Link to={ROUTES.HOME}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center font-medium"
            >
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Content Wrapper */}
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              <PageTransition key={location.pathname}>
                <Outlet />
              </PageTransition>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right Column: Branded Graphic (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 dark:bg-fintech-surface relative overflow-hidden items-center justify-center border-l border-gray-100 dark:border-fintech-border">
        
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[100px] transform -translate-x-1/2 translate-y-1/2"></div>

        {/* Floating Brand Elements */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 text-center max-w-lg px-8"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-4xl shadow-2xl shadow-blue-500/20 mb-8 transform -rotate-12 hover:rotate-0 transition-transform duration-500">
            M
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            Take control of your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
              financial journey.
            </span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-fintech-textMuted">
            Join thousands of users tracking expenses, setting smart budgets, and reaching their saving goals with MoneyHaven.
          </p>

          {/* Decorative UI elements mimicking the app */}
          <div className="mt-12 relative w-full h-48">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute top-0 right-12 w-64 h-24 bg-white dark:bg-fintech-bg rounded-xl shadow-xl border border-gray-100 dark:border-fintech-border p-4 text-left"
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Balance</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">₹4,250.00</div>
              <div className="h-1 w-full bg-gray-100 dark:bg-fintech-surface mt-3 rounded overflow-hidden">
                <div className="h-full bg-blue-500 w-2/3"></div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute bottom-4 left-8 w-56 h-20 bg-white dark:bg-fintech-bg rounded-xl shadow-xl border border-gray-100 dark:border-fintech-border p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                ↓
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Income</div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">+₹1,200.00</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
