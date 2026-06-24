import React from 'react';
import { motion } from 'framer-motion';
import { Button } from 'antd';
import { 
  PlusOutlined, 
  WalletOutlined, 
  FlagOutlined, 
  DownloadOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const QuickActionBar = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Add Transaction',
      icon: <PlusOutlined />,
      onClick: () => navigate(ROUTES.TRANSACTIONS, { state: { openModal: true, type: 'expense' } }),
      primary: true
    },
    {
      label: 'Create Budget',
      icon: <WalletOutlined />,
      onClick: () => navigate(ROUTES.BUDGETS, { state: { openModal: true } }),
      primary: false
    },
    {
      label: 'Create Goal',
      icon: <FlagOutlined />,
      onClick: () => navigate(ROUTES.GOALS, { state: { openModal: true } }),
      primary: false
    },
    {
      label: 'Export Report',
      icon: <DownloadOutlined />,
      onClick: () => navigate(ROUTES.REPORTS),
      primary: false
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="flex flex-wrap items-center gap-3 mb-8"
    >
      {actions.map((action, idx) => (
        <Button
          key={idx}
          type={action.primary ? "primary" : "default"}
          icon={action.icon}
          onClick={action.onClick}
          size="large"
          className={`rounded-full px-6 shadow-sm hover:shadow-md transition-all ${
            !action.primary && 'bg-white dark:bg-fintech-surface/80 dark:text-fintech-text dark:border-fintech-border dark:hover:border-fintech-primary dark:hover:text-fintech-primary'
          }`}
        >
          {action.label}
        </Button>
      ))}
    </motion.div>
  );
};

export default QuickActionBar;
