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

    // BYPASS OTP FOR NOW
    handleRegister();
    /*
    dispatch(sendOtpUser({ email: formData.email })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setTimeLeft(300); // 5 minutes
      }
    });
    */
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
    <div className="w-full">
      <div className="text-center mb-10">
        <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-6">
          M
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">Create an account</h1>
        <p className="text-gray-500 dark:text-fintech-textMuted text-base">
          {!otpSent ? 'Join MoneyHaven to take control of your finances.' : 'Check your email for the verification code.'}
        </p>
      </div>

      {!otpSent ? (
        // STEP 1: Details
        <form className="space-y-5" onSubmit={handleSendOtp}>
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
            label="Opening Balance (Optional)"
            type="number"
            name="openingBalance"
            placeholder="0.00"
            value={formData.openingBalance}
            onChange={handleChange}
            min="0"
            step="0.01"
          />

          {error && <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-3 rounded-lg">{error}</div>}

          <div className="pt-2">
            <AppButton type="primary" htmlType="submit" className="w-full h-12 rounded-xl text-base font-medium shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all" loading={otpLoading}>
              Create account
            </AppButton>
          </div>
        </form>
      ) : (
        // STEP 2 & 3: OTP Verification and Create Account
        <div className="space-y-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-base">
            We've sent a 6-digit verification code to <br />
            <strong className="text-gray-900 dark:text-white mt-1 block">{formData.email}</strong>
          </p>

          {!otpVerified ? (
            <div className="flex flex-col items-center gap-6">
              <Input.OTP length={6} value={otp} onChange={setOtp} disabled={otpLoading} size="large" />

              {timeLeft > 0 ? (
                <div className="text-sm font-medium text-gray-500 dark:text-fintech-textMuted">
                  Code expires in <span className="text-blue-600 dark:text-blue-400 font-mono">{formatTime(timeLeft)}</span>
                </div>
              ) : (
                <div className="text-sm font-medium text-red-500">OTP Expired</div>
              )}

              {error && <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-3 rounded-lg w-full">{error}</div>}

              <div className="flex flex-col sm:flex-row gap-4 w-full pt-2">
                <AppButton
                  onClick={handleResendOtp}
                  disabled={timeLeft > 0 || otpLoading}
                  className="flex-1 h-12 rounded-xl font-medium"
                >
                  Resend Code
                </AppButton>
                <AppButton
                  type="primary"
                  onClick={handleVerifyOtp}
                  loading={otpLoading}
                  disabled={otp.length !== 6 || timeLeft === 0}
                  className="flex-1 h-12 rounded-xl font-medium shadow-md shadow-blue-500/20"
                >
                  Verify Email
                </AppButton>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-green-600 font-medium text-base bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 p-4 rounded-xl flex items-center justify-center gap-2">
                <SafetyCertificateFilled className="text-green-500 text-xl" />
                Email Verified Successfully
              </div>
              <AppButton
                type="primary"
                onClick={handleRegister}
                loading={loading}
                className="w-full h-12 rounded-xl text-base font-medium shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                Complete Registration
              </AppButton>
            </div>
          )}
        </div>
      )}

      {!otpSent && (
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-fintech-textMuted">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            Sign in instead
          </Link>
        </div>
      )}
    </div>
  );
};

export default Register;
