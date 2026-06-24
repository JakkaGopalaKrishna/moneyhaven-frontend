import { Link } from 'react-router-dom';
import AppCard from '../../components/common/AppCard';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import { ROUTES } from '../../constants/routes';

const Login = () => {
  return (
    <AppCard className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1677ff] dark:text-blue-400 mb-2">MoneyHaven</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back! Please login to your account.</p>
      </div>
      
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <AppInput label="Email" type="email" placeholder="Enter your email" />
        <AppInput label="Password" type="password" placeholder="Enter your password" />
        
        <div className="pt-4">
          <AppButton type="primary" htmlType="submit" className="w-full">
            Login
          </AppButton>
        </div>
      </form>
      
      <div className="mt-6 text-center text-gray-500 dark:text-gray-400">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="text-[#1677ff] hover:underline">
          Register here
        </Link>
      </div>
    </AppCard>
  );
};

export default Login;
