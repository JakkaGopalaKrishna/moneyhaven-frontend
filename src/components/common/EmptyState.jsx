import { Empty } from 'antd';

const EmptyState = ({ description = 'No Data Available', className = '', ...props }) => {
  return (
    <div className={`p-8 bg-white dark:bg-[#1f1f1f] rounded-xl border border-gray-100 dark:border-gray-800 transition-colors ${className}`}>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <span className="text-gray-500 dark:text-gray-400">
            {description}
          </span>
        }
        {...props}
      />
    </div>
  );
};

export default EmptyState;
