import React from 'react';
import { Spin } from 'antd';

const LoadingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#141414] flex items-center justify-center">
      <Spin size="large" description="Loading..." />
    </div>
  );
};

export default LoadingPage;
