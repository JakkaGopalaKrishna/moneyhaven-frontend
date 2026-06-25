import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../store/authSlice';
import AppCard from '../../components/common/AppCard';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import { ROUTES } from '../../constants/routes';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch, from]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-6">
          M
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">Welcome back</h1>
        <p className="text-gray-500 dark:text-fintech-textMuted text-base">Please enter your details to sign in.</p>
      </div>
      
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AppInput 
          label="Email address" 
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
          placeholder="Enter your password" 
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        {error && <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-3 rounded-lg">{error}</div>}
        
        <div className="pt-2">
          <AppButton type="primary" htmlType="submit" className="w-full h-12 rounded-xl text-base font-medium shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all" loading={loading}>
            Sign in
          </AppButton>
        </div>
      </form>
      
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-fintech-textMuted">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
          Sign up for free
        </Link>
      </div>
    </div>
  );
};

export default Login;
