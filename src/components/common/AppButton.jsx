import { Button } from 'antd';

const AppButton = ({ children, className = '', ...props }) => {
  return (
    <Button 
      className={`font-medium rounded-lg h-auto py-2 px-4 transition-colors ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default AppButton;
