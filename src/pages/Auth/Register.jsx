import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../store/authSlice';
import AppCard from '../../components/common/AppCard';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import { ROUTES } from '../../constants/routes';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    openingBalance: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (Number(formData.openingBalance) < 0) {
      alert("Opening balance cannot be negative");
      return;
    }
    
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...registerData } = formData;
    dispatch(registerUser(registerData));
  };

  return (
    <AppCard className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1677ff] dark:text-blue-400 mb-2">MoneyHaven</h1>
        <p className="text-gray-500 dark:text-gray-400">Create a new account to get started.</p>
      </div>
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <AppInput 
            label="First Name" 
            name="firstName"
            placeholder="First name" 
            value={formData.firstName}
            onChange={handleChange}
            className="flex-1"
            required
          />
          <AppInput 
            label="Last Name" 
            name="lastName"
            placeholder="Last name" 
            value={formData.lastName}
            onChange={handleChange}
            className="flex-1"
            required
          />
        </div>
        <AppInput 
          label="Email" 
          type="email" 
          name="email"
          placeholder="Enter your email" 
          value={formData.email}
          onChange={handleChange}
          required
        />
        <AppInput 
          label="Password" 
          type="password" 
          name="password"
          placeholder="Create a password (min 8 chars)" 
          value={formData.password}
          onChange={handleChange}
          minLength={8}
          required
        />
        <AppInput 
          label="Confirm Password" 
          type="password" 
          name="confirmPassword"
          placeholder="Confirm your password" 
          value={formData.confirmPassword}
          onChange={handleChange}
          minLength={8}
          required
        />
        <AppInput 
          label="Opening Balance" 
          type="number" 
          name="openingBalance"
          placeholder="0.00" 
          value={formData.openingBalance}
          onChange={handleChange}
          min="0"
          step="0.01"
        />
        
        {error && <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</div>}
        
        <div className="pt-4">
          <AppButton type="primary" htmlType="submit" className="w-full" loading={loading}>
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
