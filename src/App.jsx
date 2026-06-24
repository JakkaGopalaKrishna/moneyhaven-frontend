import { ConfigProvider, theme } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import useTheme from './hooks/useTheme';
import LoadingPage from './pages/Loading/LoadingPage';
import { getCurrentUser } from './store/authSlice';

function App() {
  const { isDarkMode } = useTheme();
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token && !user) {
        await dispatch(getCurrentUser()).unwrap().catch(() => {
          // Token invalid or expired, authSlice handles clearing state
        });
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, [dispatch, token, user]);

  if (isInitializing) {
    return <LoadingPage />;
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          colorBgBase: isDarkMode ? '#141414' : '#ffffff',
        },
      }}
    >
      <AppRoutes />
    </ConfigProvider>
  );
}

export default App;
