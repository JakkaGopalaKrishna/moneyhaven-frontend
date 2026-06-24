import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log('Register attempt:', formData);
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
          placeholder="Create a password" 
          value={formData.password}
          onChange={handleChange}
          required
        />
        <AppInput 
          label="Confirm Password" 
          type="password" 
          name="confirmPassword"
          placeholder="Confirm your password" 
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        
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
