import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const LoadingSpinner = ({ fullScreen = false, tip = 'Loading...', size = 24 }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: size }} spin />;

  const spinner = <Spin indicator={antIcon} tip={tip} />;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-[#141414]/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
