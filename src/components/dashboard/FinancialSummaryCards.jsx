import React from 'react';
import { formatCurrency } from '../../../utils/currencyFormatter';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// Mock sparkline data
const sparklineData = [
  { value: 40 }, { value: 30 }, { value: 45 }, { value: 50 }, 
  { value: 35 }, { value: 60 }, { value: 55 }
];

const MiniSparkline = ({ color }) => (
  <div className="h-10 w-24 opacity-50">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={sparklineData}>
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          fill={color} 
          fillOpacity={0.2} 
          strokeWidth={2}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const SummaryCard = ({ title, amount, trend, trendUp, isPrimary, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`rounded-2xl p-5 border ${
        isPrimary 
          ? 'bg-fintech-surface/80 border-fintech-border shadow-card col-span-1 md:col-span-2 lg:col-span-1' 
          : 'bg-white dark:bg-fintech-surface/50 border-gray-100 dark:border-fintech-border/50 shadow-soft'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-sm font-medium ${isPrimary ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {title}
        </h3>
        <div className={`flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
          trendUp 
            ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-500/10' 
            : 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/10'
        }`}>
          {trendUp ? <ArrowUpOutlined className="mr-1" /> : <ArrowDownOutlined className="mr-1" />}
          {trend}%
        </div>
      </div>
      
      <div className="flex justify-between items-end">
        <div className={`font-bold tracking-tight ${isPrimary ? 'text-3xl text-gray-900 dark:text-white' : 'text-2xl text-gray-800 dark:text-gray-100'}`}>
          {formatCurrency(amount)}
        </div>
        <MiniSparkline color={trendUp ? '#22c55e' : '#ef4444'} />
      </div>
    </motion.div>
  );
};

const FinancialSummaryCards = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      <SummaryCard 
        title="Total Balance" 
        amount={summary?.currentBalance || 0} 
        trend={12.5} 
        trendUp={true} 
        isPrimary={true}
        delay={0.1}
      />
      <SummaryCard 
        title="Monthly Income" 
        amount={summary?.monthlyIncome || 0} 
        trend={8.2} 
        trendUp={true} 
        isPrimary={false}
        delay={0.2}
      />
      <SummaryCard 
        title="Monthly Expenses" 
        amount={summary?.monthlyExpenses || 0} 
        trend={3.1} 
        trendUp={false} 
        isPrimary={false}
        delay={0.3}
      />
      <SummaryCard 
        title="Total Savings" 
        amount={summary?.savings || 0} 
        trend={15.4} 
        trendUp={true} 
        isPrimary={false}
        delay={0.4}
      />
    </div>
  );
};

export default FinancialSummaryCards;
