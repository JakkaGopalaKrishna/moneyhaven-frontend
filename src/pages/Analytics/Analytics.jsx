import React, { useEffect } from 'react';
import { Row, Col, Typography, Statistic, Tag, Empty, Progress } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, InfoCircleOutlined, WarningOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAnalytics } from '../../store/analyticsSlice';
import { formatCurrency } from '../../utils/currencyFormatter';
import { 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer 
} from 'recharts';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';

const { Title, Text } = Typography;

const COLORS = ['#1677ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#eb2f96'];

const Analytics = () => {
  const dispatch = useDispatch();
  const { 
    overview, spending, income, budgets, goals, health, insights, forecast, loading 
  } = useSelector(state => state.analytics);

  useEffect(() => {
    dispatch(fetchAllAnalytics());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader title="Analytics & Insights" subtitle="Discover trends and actionable advice for your finances." />
        <SkeletonLoader type="stat" count={4} />
        <Row gutter={[24, 24]}>
          <Col xs={24} md={16}><SkeletonLoader type="chart" /></Col>
          <Col xs={24} md={8}><SkeletonLoader type="list" /></Col>
        </Row>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader title="Analytics & Insights" subtitle="Discover trends and actionable advice for your finances." />
        <div className="flex justify-center py-12">
          <EmptyState title="No Data Available" description="Add transactions to unlock insights!" />
        </div>
      </div>
    );
  }

  // Formatting for Recharts
  const monthlyTrendData = spending?.monthlyExpenseTrend?.map((item, index) => {
    const incItem = income?.monthlyIncomeTrend?.find(i => i.month === item.month) || { amount: 0 };
    return {
      name: item.month,
      Expense: item.amount,
      Income: incItem.amount
    };
  }) || [];

  const pieData = spending?.categoryBreakdown?.map(cat => ({
    name: cat.category,
    value: cat.amount
  })) || [];

  const renderTrendStatistic = (title, value, changePct, isGoodIfPositive = true) => {
    const isPositive = changePct > 0;
    const isGood = isGoodIfPositive ? isPositive : !isPositive;
    const color = isGood ? '#3f8600' : '#cf1322';
    return (
      <Statistic
        title={title}
        value={value}
        prefix="₹"
        valueStyle={{ color: 'inherit' }}
      />
    );
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'CRITICAL': return <ExclamationCircleOutlined className="text-red-500" />;
      case 'WARNING': return <WarningOutlined className="text-orange-500" />;
      default: return <InfoCircleOutlined className="text-blue-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      default: return 'success';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Analytics & Insights" 
        subtitle="Discover trends and actionable advice for your finances." 
      />

      {/* Comparison Widgets */}
      <Row gutter={[24, 24]}>
        <Col xs={12} lg={6}>
          <SectionCard>
            <Statistic title="This Month's Income" value={overview.thisMonthIncome} prefix="₹" />
            <div className="mt-2 text-xs">
              <span className={overview.incomeChangePercentage >= 0 ? "text-fintech-success" : "text-fintech-danger"}>
                {overview.incomeChangePercentage >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                {Math.abs(overview.incomeChangePercentage)}%
              </span>
              <span className="text-fintech-textMuted ml-1">vs last month</span>
            </div>
          </SectionCard>
        </Col>
        <Col xs={12} lg={6}>
          <SectionCard>
            <Statistic title="This Month's Expenses" value={overview.thisMonthExpenses} prefix="₹" />
            <div className="mt-2 text-xs">
              <span className={overview.expenseChangePercentage <= 0 ? "text-fintech-success" : "text-fintech-danger"}>
                {overview.expenseChangePercentage >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                {Math.abs(overview.expenseChangePercentage)}%
              </span>
              <span className="text-fintech-textMuted ml-1">vs last month</span>
            </div>
          </SectionCard>
        </Col>
        <Col xs={12} lg={6}>
          <SectionCard>
            <Statistic title="Savings Rate" value={overview.savingsRate} suffix="%" valueStyle={{ color: overview.savingsRate >= 20 ? '#22c55e' : '#f59e0b' }} />
          </SectionCard>
        </Col>
        <Col xs={12} lg={6}>
          <SectionCard>
            <Statistic title="Goal Achievement Rate" value={goals?.achievementRate || 0} suffix="%" />
          </SectionCard>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Charts Panel */}
        <Col xs={24} lg={16} className="space-y-6">
          <SectionCard title="Income vs Expense Trend">
            <div className="h-[250px] md:h-[300px] lg:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrendData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <RechartsTooltip formatter={(val) => `₹${val}`} contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937', color: '#f9fafb' }} />
                  <Legend />
                  <Area type="monotone" dataKey="Income" stroke="#22c55e" fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="Expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <SectionCard title="Expense Breakdown">
                <div className="h-[250px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(val) => `₹${val}`} contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937', color: '#f9fafb' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>
            </Col>
            <Col xs={24} md={12}>
              <SectionCard title="Budget Utilization">
                <div className="h-[250px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgets?.budgetUtilization || []} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="category" type="category" width={80} stroke="#9ca3af" />
                      <RechartsTooltip formatter={(val) => `${val}%`} contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937', color: '#f9fafb' }} />
                      <Bar dataKey="utilizationPercentage" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                        {(budgets?.budgetUtilization || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.utilizationPercentage > 100 ? '#ef4444' : '#3b82f6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>
            </Col>
          </Row>
        </Col>

        {/* Health & Insights Panel */}
        <Col xs={24} lg={8} className="space-y-6">
          <SectionCard title="Financial Health Score" className="text-center">
            <Progress 
              type="dashboard" 
              percent={health?.score || 0} 
              strokeColor={{
                '0%': '#ef4444',
                '50%': '#f59e0b',
                '100%': '#22c55e',
              }}
              format={pct => (
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold dark:text-white">{pct}</span>
                  <span className="text-xs text-fintech-textMuted font-normal mt-1">
                    {pct >= 90 ? 'Excellent' : pct >= 70 ? 'Good' : pct >= 50 ? 'Average' : 'Needs Work'}
                  </span>
                </div>
              )}
            />
          </SectionCard>

          <SectionCard title="Insights Engine">
            <div className="space-y-4">
              {insights?.insights?.length === 0 && <EmptyState description="No insights yet." icon={<InfoCircleOutlined />} />}
              {insights?.insights?.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-fintech-bg/50 rounded-xl border border-fintech-border/30">
                  <div className="mt-0.5">{getSeverityIcon(insight.severity)}</div>
                  <span className="text-sm dark:text-fintech-text">{insight.message}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Recommendations" className="bg-blue-50/50 dark:bg-fintech-primary/10">
            <div className="space-y-4">
              {insights?.recommendations?.length === 0 && <Text className="text-fintech-textMuted">No specific recommendations.</Text>}
              {insights?.recommendations?.map((rec, idx) => (
                <div key={idx} className="border-l-2 border-fintech-primary pl-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm dark:text-white">{rec.title}</span>
                    <Tag color={getPriorityColor(rec.priority)}>{rec.priority}</Tag>
                  </div>
                  <Text className="text-fintech-textMuted text-xs block">{rec.description}</Text>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="AI Forecast">
            <div className="flex justify-between items-center text-sm p-3 bg-fintech-bg/50 rounded-xl border border-fintech-border/30">
              <Text className="text-fintech-textMuted">Next Month Est. Expense</Text>
              <Text className="font-bold dark:text-white">₹{forecast?.monthlyExpenseForecast?.forecastValue}</Text>
            </div>
            <div className="flex justify-between items-center text-sm mt-3 p-3 bg-fintech-bg/50 rounded-xl border border-fintech-border/30">
              <Text className="text-fintech-textMuted">Confidence</Text>
              <Tag color="cyan" className="m-0">{forecast?.monthlyExpenseForecast?.confidence}%</Tag>
            </div>
          </SectionCard>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
