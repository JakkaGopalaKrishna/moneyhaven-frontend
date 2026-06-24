import { Card } from 'antd';

const AppCard = ({ children, className = '', ...props }) => {
  return (
    <Card 
      className={`shadow-sm rounded-xl border border-gray-100 dark:border-gray-800 dark:bg-[#1f1f1f] transition-colors duration-200 ${className}`}
      styles={{ body: { padding: '24px' } }}
      {...props}
    >
      {children}
    </Card>
  );
};

export default AppCard;
