import React from 'react';
import { Card } from 'antd';
import { motion } from 'framer-motion';

const SectionCard = ({ title, extra, children, className = '', noPadding = false, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`h-full ${className}`}
    >
      <Card
        title={title && <span className="text-gray-900 dark:text-fintech-text font-semibold text-lg">{title}</span>}
        extra={extra}
        className={`h-full shadow-soft hover:shadow-card transition-shadow duration-300 border border-gray-200 dark:border-fintech-border/50 bg-white/80 dark:bg-fintech-surface/80 backdrop-blur-md ${noPadding ? 'body-no-padding' : ''}`}
        bordered={false}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  );
};

export default SectionCard;
