import { Link } from 'react-router-dom';
import AppButton from '../../components/common/AppButton';
import { ROUTES } from '../../constants/routes';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-700 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Page Not Found</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to={ROUTES.DASHBOARD}>
        <AppButton type="primary">Go to Home</AppButton>
      </Link>
    </div>
  );
};

export default NotFound;
