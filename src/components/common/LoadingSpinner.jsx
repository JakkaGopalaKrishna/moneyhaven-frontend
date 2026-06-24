import { Spin } from 'antd';

const LoadingSpinner = ({ fullScreen = false, description = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-[#141414]">
        <Spin size="large" description={description} />
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center p-8">
      <Spin size="large" description={description} />
    </div>
  );
};

export default LoadingSpinner;
