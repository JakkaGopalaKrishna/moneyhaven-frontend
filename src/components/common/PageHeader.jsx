import React from 'react';
import { Typography } from 'antd';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6"
    >
      <div>
        <Title level={2} className="!mb-1 !text-gray-900 dark:!text-fintech-text !text-page">
          {title}
        </Title>
        {subtitle && (
          <Text className="text-gray-500 dark:text-fintech-textMuted text-body">
            {subtitle}
          </Text>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </motion.div>
  );
};

export default PageHeader;
