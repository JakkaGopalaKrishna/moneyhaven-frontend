import AppCard from '../../components/common/AppCard';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AppCard>
          <h3 className="text-gray-500 dark:text-gray-400">Total Balance</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">$0.00</p>
        </AppCard>
        <AppCard>
          <h3 className="text-gray-500 dark:text-gray-400">Monthly Income</h3>
          <p className="text-3xl font-bold text-green-500 mt-2">$0.00</p>
        </AppCard>
        <AppCard>
          <h3 className="text-gray-500 dark:text-gray-400">Monthly Expenses</h3>
          <p className="text-3xl font-bold text-red-500 mt-2">$0.00</p>
        </AppCard>
      </div>
    </div>
  );
};

export default Dashboard;
