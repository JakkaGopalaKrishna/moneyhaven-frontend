import React from 'react';
import { Empty, Typography } from 'antd';
import { motion } from 'framer-motion';

const { Text } = Typography;

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action, 
  className = '' 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center p-8 text-center bg-fintech-surface/30 rounded-2xl border border-dashed border-fintech-border/60 ${className}`}
    >
      {icon ? (
        <div className="text-5xl text-fintech-textMuted mb-4 opacity-50">
          {icon}
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={false} className="mb-4" />
      )}
      
      <h3 className="text-fintech-text font-medium text-lg mb-2">{title}</h3>
      
      {description && (
        <Text className="text-fintech-textMuted max-w-md mb-6 block">
          {description}
        </Text>
      )}
      
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;
