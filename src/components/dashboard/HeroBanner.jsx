import React from 'react';
import { formatCurrency } from '../../utils/currencyFormatter';
import { motion } from 'framer-motion';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { Progress } from 'antd';

const HeroBanner = ({ user, summary }) => {
  const currentHour = new Date().getHours();
  let greeting = 'Good Evening';
  if (currentHour < 12) greeting = 'Good Morning';
  else if (currentHour < 18) greeting = 'Good Afternoon';

  // Mock trend for demonstration as backend doesn't provide historical trend yet
  const mockTrend = 12.5; 

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-900 text-white shadow-card relative overflow-hidden"
    >
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
      <div className="absolute bottom-0 left-20 w-40 h-40 rounded-full bg-blue-400 opacity-10 blur-2xl"></div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-light text-blue-100 mb-1">
            {greeting}, <span className="font-semibold text-white">{user?.firstName}</span> <span className="text-2xl">👋</span>
          </h1>
          <p className="text-blue-200 text-sm mb-6">Here's your money at a glance.</p>
          
          <div className="mt-4">
            <p className="text-blue-200 text-sm font-medium mb-1 uppercase tracking-wider">Net Worth</p>
            <div className="flex items-baseline gap-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                {formatCurrency(summary?.currentBalance || 0)}
              </h2>
              <div className="flex items-center text-green-300 bg-green-500/20 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                <ArrowUpOutlined className="mr-1" />
                {mockTrend}%
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex items-center gap-6">
          <div>
            <p className="text-blue-200 text-xs uppercase tracking-wider mb-1">Health Score</p>
            <div className="text-2xl font-bold">{summary?.healthScore || 0}<span className="text-sm font-normal text-blue-200">/100</span></div>
            <p className="text-xs text-blue-200 mt-1">
              {summary?.healthScore >= 80 ? 'Excellent' : summary?.healthScore >= 60 ? 'Good' : 'Needs attention'}
            </p>
          </div>
          <div className="h-16 w-px bg-white/20"></div>
          <div className="w-16 h-16 relative">
            <Progress 
              type="circle" 
              percent={summary?.healthScore || 0} 
              size={64}
              strokeColor={{ '0%': '#ef4444', '100%': '#22c55e' }}
              trailColor="rgba(255,255,255,0.1)"
              format={() => ''}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroBanner;
