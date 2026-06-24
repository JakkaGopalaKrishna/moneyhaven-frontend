import { ConfigProvider, theme } from 'antd';
import AppRoutes from './routes/AppRoutes';
import useTheme from './hooks/useTheme';

function App() {
  const { isDarkMode } = useTheme();

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
