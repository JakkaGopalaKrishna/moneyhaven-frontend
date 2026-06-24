import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError, sendOtpUser, verifyOtpUser, resetOtpState } from '../../store/authSlice';
import AppCard from '../../components/common/AppCard';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import { ROUTES } from '../../constants/routes';
import { Input, Typography } from 'antd';
import { SafetyCertificateFilled } from '@ant-design/icons';

const { Title, Text } = Typography;

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    openingBalance: '',
  });

  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, otpSent, otpVerified, otpLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
    return () => {
      dispatch(clearError());
      dispatch(resetOtpState());
    };
  }, [isAuthenticated, navigate, dispatch]);

  // Countdown Timer Logic
  useEffect(() => {
    let timer;
    if (otpSent && !otpVerified && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, otpVerified, timeLeft]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (Number(formData.openingBalance) < 0) {
      alert("Opening balance cannot be negative");
      return;
    }
    dispatch(sendOtpUser({ email: formData.email })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setTimeLeft(300); // 5 minutes
      }
    });
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 6) return;
    dispatch(verifyOtpUser({ email: formData.email, otp }));
  };

  const handleResendOtp = () => {
    dispatch(sendOtpUser({ email: formData.email })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setTimeLeft(300);
      }
    });
  };

  const handleRegister = () => {
    const { confirmPassword, ...registerData } = formData;
    dispatch(registerUser(registerData));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <AppCard className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1677ff] dark:text-blue-400 mb-2">MoneyHaven</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {!otpSent ? 'Create a new account to get started.' : 'Verify your email address.'}
        </p>
      </div>

      {!otpSent ? (
        // STEP 1: Details
        <form className="space-y-4" onSubmit={handleSendOtp}>
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
            <AppButton type="primary" htmlType="submit" className="w-full" loading={otpLoading}>
              Send OTP
            </AppButton>
          </div>
        </form>
      ) : (
        // STEP 2 & 3: OTP Verification and Create Account
        <div className="space-y-6 text-center">
          <Text className="text-gray-600 dark:text-gray-300">
            We've sent a 6-digit verification code to <br />
            <strong className="text-gray-800 dark:text-gray-100">{formData.email}</strong>
          </Text>

          {!otpVerified ? (
            <div className="flex flex-col items-center gap-4">
              <Input.OTP length={6} value={otp} onChange={setOtp} disabled={otpLoading} />

              {timeLeft > 0 ? (
                <Text type="secondary" className="font-mono text-lg">
                  Time remaining: {formatTime(timeLeft)}
                </Text>
              ) : (
                <Text type="danger">OTP Expired</Text>
              )}

              {error && <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded w-full">{error}</div>}

              <div className="flex gap-4 w-full">
                <AppButton
                  onClick={handleResendOtp}
                  disabled={timeLeft > 0 || otpLoading}
                  className="flex-1"
                >
                  Resend OTP
                </AppButton>
                <AppButton
                  type="primary"
                  onClick={handleVerifyOtp}
                  loading={otpLoading}
                  disabled={otp.length !== 6 || timeLeft === 0}
                  className="flex-1"
                >
                  Verify OTP
                </AppButton>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-green-500 font-medium text-lg bg-green-50 dark:bg-green-900/20 p-3 rounded">
                <SafetyCertificateFilled className="text-green-500 mr-2" />OTP Verified Successfully
              </div>
              <AppButton
                type="primary"
                onClick={handleRegister}
                loading={loading}
                className="w-full"
              >
                Create Account
              </AppButton>
            </div>
          )}
        </div>
      )}

      {!otpSent && (
        <div className="mt-6 text-center text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="text-[#1677ff] hover:underline">
            Login here
          </Link>
        </div>
      )}
    </AppCard>
  );
};

export default Register;
