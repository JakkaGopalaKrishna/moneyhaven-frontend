import { Input } from 'antd';

const AppInput = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <Input 
        className={`rounded-lg py-2 transition-colors dark:bg-[#141414] dark:border-gray-700 dark:text-white ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default AppInput;
