import React, { useEffect } from 'react';
import { Row, Col, Typography, Statistic, Tag, Empty, Progress } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, InfoCircleOutlined, WarningOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAnalytics } from '../../store/analyticsSlice';
import { formatCurrency } from '../../utils/currencyFormatter';
import dayjs from 'dayjs';
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
  const allDates = new Set([
    ...(spending?.dailyExpenseTrend?.map(i => i.date) || []),
    ...(income?.dailyIncomeTrend?.map(i => i.date) || [])
  ]);

  const dailyTrendData = Array.from(allDates).sort().map(date => {
    const expItem = spending?.dailyExpenseTrend?.find(i => i.date === date) || { amount: 0 };
    const incItem = income?.dailyIncomeTrend?.find(i => i.date === date) || { amount: 0 };
    return {
      name: dayjs(date).format('MMM D'),
      Expense: expItem.amount,
      Income: incItem.amount
    };
  });

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

      <Row gutter={[24, 24]} className="flex-wrap">
        {/* Income vs Expense Trend */}
        <Col xs={{ span: 24, order: 2 }} lg={{ span: 16, order: 1 }}>
          <SectionCard title="Income vs Expense Trend" className="p-2 md:p-5 h-full">
            <div className="h-[220px] md:h-[350px] lg:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
                  <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 10 }} minTickGap={15} />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} width={55} tickFormatter={(val) => `₹${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`} />
                  <RechartsTooltip formatter={(val) => `₹${val}`} contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937', color: '#f9fafb' }} />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} />
                  <Area type="monotone" dataKey="Income" stroke="#22c55e" fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="Expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </Col>

        {/* Expense Breakdown */}
        <Col xs={{ span: 24, order: 3 }} lg={{ span: 8, order: 2 }}>
          <SectionCard title="Expense Breakdown" className="p-2 md:p-5 h-full">
            <div className="h-[250px] md:h-[300px] lg:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(val) => `₹${val}`} contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937', color: '#f9fafb' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </Col>

        {/* Budget Utilization */}
        <Col xs={{ span: 24, order: 4 }} lg={{ span: 8, order: 3 }}>
          <SectionCard title="Budget Utilization" className="p-2 md:p-5 h-full">
            <div className="h-[250px] md:h-[300px] lg:h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgets?.budgetUtilization || []} layout="vertical" margin={{ top: 5, right: 10, bottom: 5, left: -25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="category" type="category" width={80} stroke="#9ca3af" tick={{ fontSize: 10 }} />
                  <RechartsTooltip formatter={(val) => `${val}%`} contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937', color: '#f9fafb' }} />
                  <Bar dataKey="utilizationPercentage" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                    {(budgets?.budgetUtilization || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.utilizationPercentage > 100 ? '#ef4444' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </Col>

        {/* Health Score */}
        <Col xs={{ span: 24, order: 1 }} lg={{ span: 8, order: 4 }}>
          <SectionCard title="Financial Health Score" className="text-center h-full flex flex-col justify-center">
            <div className="flex justify-center items-center lg:h-[260px]">
              <Progress 
                type="dashboard" 
                percent={health?.score || 0} 
                size={180}
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
            </div>
          </SectionCard>
        </Col>

        {/* Forecast */}
        <Col xs={{ span: 24, order: 7 }} lg={{ span: 8, order: 5 }}>
          <SectionCard title="AI Forecast" className="h-full flex flex-col justify-center">
            <div className="flex flex-col justify-center gap-4 lg:h-[260px]">
              <div className="flex justify-between items-center text-sm p-4 bg-fintech-bg/50 rounded-xl border border-fintech-border/30">
                <Text className="text-fintech-textMuted">Next Month Est. Expense</Text>
                <Text className="font-bold dark:text-white text-lg">₹{forecast?.monthlyExpenseForecast?.forecastValue}</Text>
              </div>
              <div className="flex justify-between items-center text-sm p-4 bg-fintech-bg/50 rounded-xl border border-fintech-border/30">
                <Text className="text-fintech-textMuted">Confidence Level</Text>
                <Tag color="cyan" className="m-0 px-3 py-1 text-sm">{forecast?.monthlyExpenseForecast?.confidence}%</Tag>
              </div>
            </div>
          </SectionCard>
        </Col>

        {/* Insights */}
        <Col xs={{ span: 24, order: 5 }} lg={{ span: 12, order: 6 }}>
          <SectionCard title="Insights Engine" className="h-full">
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {insights?.insights?.length === 0 && <EmptyState description="No insights yet." icon={<InfoCircleOutlined />} />}
              {insights?.insights?.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-fintech-bg/50 rounded-xl border border-fintech-border/30">
                  <div className="mt-0.5">{getSeverityIcon(insight.severity)}</div>
                  <span className="text-sm dark:text-fintech-text">{insight.message}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </Col>

        {/* Recommendations */}
        <Col xs={{ span: 24, order: 6 }} lg={{ span: 12, order: 7 }}>
          <SectionCard title="Recommendations" className="bg-blue-50/50 dark:bg-fintech-primary/10 h-full">
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {insights?.recommendations?.length === 0 && <Text className="text-fintech-textMuted">No specific recommendations.</Text>}
              {insights?.recommendations?.map((rec, idx) => (
                <div key={idx} className="border-l-2 border-fintech-primary pl-4 bg-white/50 dark:bg-fintech-surface/50 p-3 rounded-r-xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm dark:text-white">{rec.title}</span>
                    <Tag color={getPriorityColor(rec.priority)} className="m-0 text-[10px]">{rec.priority}</Tag>
                  </div>
                  <Text className="text-fintech-textMuted text-xs block">{rec.description}</Text>
                </div>
              ))}
            </div>
          </SectionCard>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
