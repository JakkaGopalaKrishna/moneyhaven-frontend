import { useRouteError, Link } from 'react-router-dom';
import AppButton from '../../components/common/AppButton';
import { ROUTES } from '../../constants/routes';

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-[#141414] transition-colors duration-200">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Oops!</h1>
      <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">Sorry, an unexpected error has occurred.</p>
      <p className="text-gray-500 mb-8 max-w-md text-center italic">
        {error?.statusText || error?.message || "Unknown error"}
      </p>
      <Link to={ROUTES.DASHBOARD}>
        <AppButton type="primary">Return to Dashboard</AppButton>
      </Link>
    </div>
  );
};

export default ErrorPage;
