import { ConfigProvider, theme } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import useTheme from './hooks/useTheme';
import LoadingPage from './pages/Loading/LoadingPage';
import { getCurrentUser } from './store/authSlice';
import { THEME } from './constants/theme';

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
          colorPrimary: THEME.colors.primary,
          colorSuccess: THEME.colors.success,
          colorWarning: THEME.colors.warning,
          colorError: THEME.colors.danger,
          colorBgBase: isDarkMode ? THEME.colors.dark.background : THEME.colors.light.background,
          colorTextBase: isDarkMode ? THEME.colors.dark.textPrimary : THEME.colors.light.textPrimary,
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        },
        components: {
          Card: {
            colorBgContainer: isDarkMode ? THEME.colors.dark.surface : THEME.colors.light.surface,
            colorBorderSecondary: isDarkMode ? THEME.colors.dark.border : THEME.colors.light.border,
          }
        }
      }}
    >
      <AppRoutes />
    </ConfigProvider>
  );
}

export default App;
