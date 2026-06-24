import LoadingSpinner from '../../components/common/LoadingSpinner';

const LoadingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#141414] transition-colors duration-200">
      <LoadingSpinner fullScreen tip="Loading MoneyHaven..." />
    </div>
  );
};

export default LoadingPage;
