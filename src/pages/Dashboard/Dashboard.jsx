import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Row, Col, Statistic, Progress, Button, Empty, Skeleton, Badge, Space, List } from 'antd';
import { 
  WalletOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  BankOutlined, 
  TransactionOutlined, 
  ReloadOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  PieChartOutlined,
  FlagOutlined
} from '@ant-design/icons';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';
import { getDashboardSummaryUser, getDashboardStatsUser } from '../../store/dashboardSlice';
import { DASHBOARD_CONSTANTS } from '../../constants/dashboard';
import { TRANSACTION_TYPES } from '../../constants/transactions';
import { formatCurrency } from '../../utils/currencyFormatter';
import dayjs from 'dayjs';

const { TITLES, LABELS, EMPTY_STATES } = DASHBOARD_CONSTANTS;

const AnimatedValue = ({ value, isCurrency = true }) => {
  const CountUpComponent = CountUp.default || CountUp;
  if (!isCurrency) return <CountUpComponent end={value || 0} duration={2} separator="," />;
  
  return (
    <CountUpComponent 
      end={value || 0} 
      duration={2} 
      separator="," 
      decimals={2} 
      prefix="₹" 
    />
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { summary, stats, loading } = useSelector((state) => state.dashboard);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    dispatch(getDashboardSummaryUser());
    dispatch(getDashboardStatsUser());
    
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(getDashboardSummaryUser());
    dispatch(getDashboardStatsUser());
  };

  // Skeleton placeholders
  if (loading && !summary) {
    return (
      <div className="max-w-7xl mx-auto py-6 space-y-6">
        <Skeleton active paragraph={{ rows: 2 }} />
        <Row gutter={[16, 16]}>
          {[1, 2, 3, 4].map((i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <Card><Skeleton active paragraph={{ rows: 1 }} /></Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6 px-4">
      {/* Welcome Banner & Refresh */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1f1f1f] p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {greeting}, {user?.firstName} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Here's your financial overview for today.</p>
        </div>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />} 
          onClick={handleRefresh} 
          loading={loading}
        >
          Refresh Dashboard
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {/* Left Column: Summary & Stats */}
        <Col xs={24} lg={16} className="space-y-6">
          <Card title={TITLES.SUMMARY} className="shadow-sm">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={8}>
                <Card variant="borderless" className="bg-blue-50 dark:bg-blue-900/20">
                  <Statistic 
                    title={LABELS.CURRENT_BALANCE}
                    formatter={(val) => <AnimatedValue value={val} />}
                    value={summary?.currentBalance || 0}
                    prefix={<WalletOutlined className="text-blue-500 mr-2" />}
                    styles={{ content: { color: '#1677ff', fontWeight: 'bold' } }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Card variant="borderless" className="bg-green-50 dark:bg-green-900/20">
                  <Statistic 
                    title={LABELS.TOTAL_INCOME}
                    formatter={(val) => <AnimatedValue value={val} />}
                    value={summary?.totalIncome || 0}
                    prefix={<ArrowUpOutlined className="text-green-500 mr-2" />}
                    styles={{ content: { color: '#3f8600' } }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Card variant="borderless" className="bg-red-50 dark:bg-red-900/20">
                  <Statistic 
                    title={LABELS.TOTAL_EXPENSES}
                    formatter={(val) => <AnimatedValue value={val} />}
                    value={summary?.totalExpenses || 0}
                    prefix={<ArrowDownOutlined className="text-red-500 mr-2" />}
                    styles={{ content: { color: '#cf1322' } }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Card variant="borderless" className="bg-purple-50 dark:bg-purple-900/20">
                  <Statistic 
                    title={LABELS.SAVINGS}
                    formatter={(val) => <AnimatedValue value={val} />}
                    value={summary?.savings || 0}
                    prefix={<BankOutlined className="text-purple-500 mr-2" />}
                    styles={{ content: { color: '#722ed1' } }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Card variant="borderless" className="bg-gray-50 dark:bg-gray-800">
                  <Statistic 
                    title={LABELS.OPENING_BALANCE}
                    formatter={(val) => <AnimatedValue value={val} />}
                    value={summary?.openingBalance || 0}
                    styles={{ content: { color: '#8c8c8c' } }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Card variant="borderless" className="bg-gray-50 dark:bg-gray-800">
                  <Statistic 
                    title={LABELS.TOTAL_TRANSACTIONS}
                    formatter={(val) => <AnimatedValue value={val} isCurrency={false} />}
                    value={summary?.totalTransactions || 0}
                    prefix={<TransactionOutlined className="text-gray-500 mr-2" />}
                    styles={{ content: { color: '#8c8c8c' } }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title={TITLES.ACTIVITY} className="h-full shadow-sm" extra={<a onClick={() => navigate('/transactions')}>View All</a>}>
                {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
                  <List
                    dataSource={stats.recentTransactions}
                    renderItem={item => (
                      <List.Item
                        actions={[
                          <span className={item.type === TRANSACTION_TYPES.INCOME ? 'text-green-500 font-medium' : 'text-red-500 font-medium'}>
                            {item.type === TRANSACTION_TYPES.INCOME ? '+' : '-'} {formatCurrency(item.amount)}
                          </span>
                        ]}
                      >
                        <List.Item.Meta
                          title={<span className="dark:text-white">{item.title}</span>}
                          description={dayjs(item.transactionDate).format('MMM D, YYYY')}
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description={EMPTY_STATES.TRANSACTIONS} />
                )}
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title={TITLES.INSIGHTS} className="h-full shadow-sm" extra={<a onClick={() => navigate('/budgets')}>Budgets</a>}>
                {summary?.budgetSummary ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex justify-between items-center">
                      <span className="text-red-700 dark:text-red-400 font-medium">Most Overspent</span>
                      <span className="font-bold dark:text-white">
                        {summary.budgetSummary.mostOverspent ? `${summary.budgetSummary.mostOverspent.category} (${summary.budgetSummary.mostOverspent.percentage.toFixed(0)}%)` : 'None'}
                      </span>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex justify-between items-center">
                      <span className="text-green-700 dark:text-green-400 font-medium">Highest Remaining</span>
                      <span className="font-bold dark:text-white">
                        {summary.budgetSummary.highestRemaining ? `${summary.budgetSummary.highestRemaining.category} (${formatCurrency(summary.budgetSummary.highestRemaining.amount)})` : 'None'}
                      </span>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex justify-between items-center">
                      <span className="text-blue-700 dark:text-blue-400 font-medium">Total Budget</span>
                      <span className="font-bold dark:text-white">
                        {formatCurrency(summary.budgetSummary.totalBudgetAmount)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <Empty description={EMPTY_STATES.CHARTS} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Right Column: Account & Quick Actions */}
        <Col xs={24} lg={8} className="space-y-6">
          <Card title={LABELS.HEALTH_SCORE} className="shadow-sm text-center">
            <Progress 
              type="dashboard" 
              percent={summary?.budgetSummary?.budgetHealthScore || summary?.healthScore || 0} 
              format={(percent) => `${percent}/100`}
              strokeColor={{
                '0%': '#ff4d4f',
                '100%': '#52c41a',
              }}
            />
            <p className="mt-4 text-gray-500 dark:text-gray-400">Your financial health is looking great!</p>
            <Button type="link" onClick={() => navigate('/analytics')} className="mt-2">
              View Full Analysis
            </Button>
          </Card>

          <Card title={TITLES.ACTIONS} className="shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                type="dashed" 
                icon={<PlusCircleOutlined />} 
                className="h-20 flex flex-col items-center justify-center text-green-600 hover:text-green-500 hover:border-green-500"
                onClick={() => navigate('/income')}
              >
                <span className="mt-2">Add Income</span>
              </Button>
              <Button 
                type="dashed" 
                icon={<MinusCircleOutlined />} 
                className="h-20 flex flex-col items-center justify-center text-red-600 hover:text-red-500 hover:border-red-500"
                onClick={() => navigate('/expenses')}
              >
                <span className="mt-2">Add Expense</span>
              </Button>
              <Button 
                type="dashed" 
                icon={<PieChartOutlined />} 
                className="h-20 flex flex-col items-center justify-center text-blue-600 hover:text-blue-500 hover:border-blue-500"
                onClick={() => navigate('/budgets')}
              >
                <span className="mt-2">Set Budget</span>
              </Button>
              <Button 
                type="dashed" 
                icon={<FlagOutlined />} 
                className="h-20 flex flex-col items-center justify-center text-purple-600 hover:text-purple-500 hover:border-purple-500"
                onClick={() => navigate('/goals')}
              >
                <span className="mt-2">Create Goal</span>
              </Button>
            </div>
            <Button 
              type="dashed" 
              block
              className="mt-4 h-12 text-indigo-600 border-indigo-200 hover:text-indigo-500 hover:border-indigo-500"
              onClick={() => navigate('/reports')}
            >
              Export Financial Reports
            </Button>
          </Card>

          <Card title="Savings Goals" className="shadow-sm" extra={<a onClick={() => navigate('/goals')}>View All</a>}>
            {summary?.savingsGoalsSummary ? (
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-gray-500 dark:text-gray-400">Overall Progress</span>
                  <span className="font-bold text-lg dark:text-white">{summary.savingsGoalsSummary.overallProgress}%</span>
                </div>
                <Progress percent={summary.savingsGoalsSummary.overallProgress} strokeColor="#722ed1" showInfo={false} />
                
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                  {summary.savingsGoalsSummary.topGoals.map((g, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="font-medium dark:text-white truncate max-w-[120px]" title={g.title}>{g.title}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{dayjs(g.targetDate).format('MMM D')}</span>
                      </div>
                      <Progress type="circle" percent={g.progressPercentage} width={40} />
                    </div>
                  ))}
                  {summary.savingsGoalsSummary.topGoals.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-2">No active goals found.</div>
                  )}
                </div>
              </div>
            ) : (
              <Empty description={EMPTY_STATES.CHARTS} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>

          <Card title={TITLES.ACCOUNT} className="shadow-sm">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                <span className="text-gray-500 dark:text-gray-400">Full Name</span>
                <span className="font-medium dark:text-white">{user?.firstName} {user?.lastName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                <span className="text-gray-500 dark:text-gray-400">Email</span>
                <span className="font-medium dark:text-white truncate max-w-[150px]" title={user?.email}>{user?.email}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                <span className="text-gray-500 dark:text-gray-400">Opening Balance</span>
                <span className="font-medium dark:text-white">{formatCurrency(user?.openingBalance)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                {user?.isVerified ? (
                  <Badge status="success" text="Verified Email" className="dark:text-white" />
                ) : (
                  <Badge status="warning" text="Unverified" className="dark:text-white" />
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Member Since</span>
                <span className="font-medium dark:text-white">
                  {summary?.memberSince ? new Date(summary.memberSince).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
