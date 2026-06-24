import { Link } from 'react-router-dom';
import AppCard from '../../components/common/AppCard';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import { ROUTES } from '../../constants/routes';

const Register = () => {
  return (
    <AppCard className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1677ff] dark:text-blue-400 mb-2">MoneyHaven</h1>
        <p className="text-gray-500 dark:text-gray-400">Create a new account to get started.</p>
      </div>
      
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <AppInput label="Full Name" placeholder="Enter your full name" />
        <AppInput label="Email" type="email" placeholder="Enter your email" />
        <AppInput label="Password" type="password" placeholder="Create a password" />
        
        <div className="pt-4">
          <AppButton type="primary" htmlType="submit" className="w-full">
            Register
          </AppButton>
        </div>
      </form>
      
      <div className="mt-6 text-center text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-[#1677ff] hover:underline">
          Login here
        </Link>
      </div>
    </AppCard>
  );
};

export default Register;
