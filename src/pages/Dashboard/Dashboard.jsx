import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, List, Progress, Badge, Button } from 'antd';
import { 
  DownOutlined, 
  UpOutlined, 
  SettingOutlined,
  EyeInvisibleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getDashboardSummaryUser, getDashboardStatsUser } from '../../store/dashboardSlice';
import { fetchNotifications } from '../../store/notificationSlice';
import { formatCurrency } from '../../utils/currencyFormatter';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';

import HeroBanner from '../../components/dashboard/HeroBanner';
import FinancialSummaryCards from '../../components/dashboard/FinancialSummaryCards';
import QuickActionBar from '../../components/dashboard/QuickActionBar';
import SectionCard from '../../components/common/SectionCard';
import EmptyState from '../../components/common/EmptyState';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { summary, stats, loading } = useSelector((state) => state.dashboard);
  const { notifications } = useSelector((state) => state.notifications);

  // Personalization: LocalStorage
  const [collapsedSections, setCollapsedSections] = useState(() => {
    const saved = localStorage.getItem('moneyhaven_dashboard_collapsed');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    dispatch(getDashboardSummaryUser());
    dispatch(getDashboardStatsUser());
    dispatch(fetchNotifications('unread'));
  }, [dispatch]);

  const toggleSection = (sectionKey) => {
    const updated = { ...collapsedSections, [sectionKey]: !collapsedSections[sectionKey] };
    setCollapsedSections(updated);
    localStorage.setItem('moneyhaven_dashboard_collapsed', JSON.stringify(updated));
  };

  if (loading && !summary) {
    return (
      <div className="space-y-6">
        <SkeletonLoader type="chart" />
        <SkeletonLoader type="stat" count={4} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Hero Banner */}
      <HeroBanner user={user} summary={summary} />

      {/* 2. Quick Actions */}
      <QuickActionBar />

      {/* 3. Financial Summary Cards */}
      <FinancialSummaryCards summary={summary} />

      {/* 4. Charts Section (Placeholder link to analytics for now to keep Dashboard light, or simplified view) */}
      <SectionCard 
        title="Financial Insights" 
        extra={<Button type="link" onClick={() => navigate('/analytics')}>Full Analytics</Button>}
      >
        <div className="h-[250px] md:h-[300px] lg:h-[400px] flex items-center justify-center bg-fintech-surface/50 rounded-xl border border-fintech-border/30">
          <div className="text-center">
            <div className="text-4xl mb-4">📈</div>
            <p className="text-fintech-textMuted">Analytics charts have been moved to the dedicated Analytics module for better performance.</p>
            <Button type="primary" className="mt-4" onClick={() => navigate('/analytics')}>View Charts</Button>
          </div>
        </div>
      </SectionCard>

      <Row gutter={[24, 24]}>
        {/* 5. Recent Transactions */}
        <Col xs={24} lg={12}>
          <SectionCard 
            title="Recent Transactions" 
            extra={<Button type="link" onClick={() => navigate('/transactions')}>View All</Button>}
          >
            {stats?.recentTransactions?.length > 0 ? (
              <List
                dataSource={stats.recentTransactions}
                renderItem={item => (
                  <List.Item className="border-b border-fintech-border/30 py-3 last:border-0 hover:bg-fintech-bg/50 px-2 rounded-lg transition-colors cursor-pointer">
                    <List.Item.Meta
                      avatar={<div className="w-10 h-10 rounded-full bg-fintech-bg flex items-center justify-center text-lg">{item.type === 'income' ? '💰' : '🛒'}</div>}
                      title={<span className="text-fintech-text font-medium">{item.title}</span>}
                      description={<span className="text-fintech-textMuted text-xs">{dayjs(item.transactionDate).format('MMM D, YYYY')}</span>}
                    />
                    <div className={`font-medium ${item.type === 'income' ? 'text-fintech-success' : 'text-fintech-danger'}`}>
                      {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <EmptyState 
                title="No Transactions Found" 
                description="Start tracking your spending by adding your first transaction." 
                action={<Button type="primary" onClick={() => navigate('/transactions', { state: { openModal: true } })}>Add Transaction</Button>} 
              />
            )}
          </SectionCard>
        </Col>

        {/* 6. Budget Overview */}
        <Col xs={24} lg={12}>
          <SectionCard 
            title="Budget Overview" 
            extra={
              <div className="flex gap-2">
                <Button type="text" icon={collapsedSections['budgets'] ? <EyeInvisibleOutlined /> : <DownOutlined />} onClick={() => toggleSection('budgets')} />
              </div>
            }
          >
            <AnimatePresence>
              {!collapsedSections['budgets'] && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  {summary?.budgetSummary?.totalBudgetAmount > 0 ? (
                    <div className="space-y-4 pt-2">
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-fintech-textMuted">Overall Usage</span>
                        <span className="font-bold text-fintech-text">{summary.budgetSummary.overallBudgetUsagePercentage}%</span>
                      </div>
                      <Progress 
                        percent={summary.budgetSummary.overallBudgetUsagePercentage} 
                        strokeColor={summary.budgetSummary.overallBudgetUsagePercentage > 90 ? '#ef4444' : '#3b82f6'} 
                        showInfo={false} 
                      />
                      <div className="flex justify-between text-xs mt-2">
                        <span className="text-fintech-textMuted">Spent: {formatCurrency(summary.budgetSummary.totalBudgetSpending)}</span>
                        <span className="text-fintech-textMuted">Remaining: {formatCurrency(summary.budgetSummary.overallRemainingBudget)}</span>
                      </div>
                    </div>
                  ) : (
                    <EmptyState 
                      title="No Active Budgets" 
                      description="Set up a budget to keep your spending in check."
                      action={<Button type="primary" onClick={() => navigate('/budgets')}>Create Budget</Button>}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </SectionCard>
        </Col>

        {/* 7. Goals Overview */}
        <Col xs={24} lg={12}>
          <SectionCard 
            title="Savings Goals" 
            extra={<Button type="text" icon={collapsedSections['goals'] ? <EyeInvisibleOutlined /> : <DownOutlined />} onClick={() => toggleSection('goals')} />}
          >
            <AnimatePresence>
              {!collapsedSections['goals'] && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-2">
                  {summary?.savingsGoalsSummary?.topGoals?.length > 0 ? (
                    <div className="space-y-4">
                      {summary.savingsGoalsSummary.topGoals.map((g, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-fintech-bg/50 rounded-xl border border-fintech-border/30">
                          <div>
                            <div className="text-fintech-text font-medium">{g.title}</div>
                            <div className="text-fintech-textMuted text-xs">Target: {dayjs(g.targetDate).format('MMM YYYY')}</div>
                          </div>
                          <Progress type="circle" percent={g.progressPercentage} width={40} strokeColor="#22c55e" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState 
                      title="No Goals Set" 
                      description="Start saving for your dreams."
                      action={<Button type="primary" onClick={() => navigate('/goals')}>Set a Goal</Button>}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </SectionCard>
        </Col>

        {/* 8. Notifications */}
        <Col xs={24} lg={12}>
          <SectionCard 
            title="Recent Alerts" 
            extra={<Button type="text" icon={collapsedSections['notifications'] ? <EyeInvisibleOutlined /> : <DownOutlined />} onClick={() => toggleSection('notifications')} />}
          >
            <AnimatePresence>
              {!collapsedSections['notifications'] && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-2">
                  {notifications?.length > 0 ? (
                    <List
                      dataSource={notifications.slice(0, 3)}
                      renderItem={(item) => (
                        <List.Item className="border-b border-fintech-border/30 py-3 last:border-0">
                          <List.Item.Meta
                            title={<span className="text-sm font-medium text-fintech-text">{item.title}</span>}
                            description={<span className="text-xs text-fintech-textMuted">{item.message}</span>}
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <EmptyState title="All Caught Up!" description="You have no new alerts." />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </SectionCard>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
