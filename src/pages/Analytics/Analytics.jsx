import React, { useEffect } from 'react';
import { Row, Col, Typography, Card, Statistic, Spin, Alert, Tag, Empty, Progress } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, InfoCircleOutlined, WarningOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAnalytics } from '../../store/analyticsSlice';
import { formatCurrency } from '../../utils/currencyFormatter';
import { 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer 
} from 'recharts';

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
      <div className="max-w-7xl mx-auto py-6 space-y-6 px-4">
        <Title level={2}>Analytics & Insights</Title>
        <Row gutter={[16, 16]}>
          {[1, 2, 3, 4].map(i => (
            <Col xs={12} sm={6} key={i}>
              <Card loading className="h-32" />
            </Col>
          ))}
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={16}><Card loading className="h-80" /></Col>
          <Col xs={24} md={8}><Card loading className="h-80" /></Col>
        </Row>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 flex justify-center items-center h-full">
        <Empty description="No data available. Add transactions to unlock insights!" />
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
    <div className="max-w-7xl mx-auto py-6 space-y-6 px-4">
      {/* Header */}
      <div>
        <Title level={2} className="!mb-1 dark:text-white">Analytics & Insights</Title>
        <Text className="text-gray-500 dark:text-gray-400">Discover trends and actionable advice for your finances.</Text>
      </div>

      {/* Comparison Widgets */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="This Month's Income" value={overview.thisMonthIncome} prefix="₹" />
            <div className="mt-2 text-xs">
              <span className={overview.incomeChangePercentage >= 0 ? "text-green-500" : "text-red-500"}>
                {overview.incomeChangePercentage >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                {Math.abs(overview.incomeChangePercentage)}%
              </span>
              <span className="text-gray-400 ml-1">vs last month</span>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="This Month's Expenses" value={overview.thisMonthExpenses} prefix="₹" />
            <div className="mt-2 text-xs">
              <span className={overview.expenseChangePercentage <= 0 ? "text-green-500" : "text-red-500"}>
                {overview.expenseChangePercentage >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                {Math.abs(overview.expenseChangePercentage)}%
              </span>
              <span className="text-gray-400 ml-1">vs last month</span>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Savings Rate" value={overview.savingsRate} suffix="%" valueStyle={{ color: overview.savingsRate >= 20 ? '#52c41a' : '#faad14' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Goal Achievement Rate" value={goals?.achievementRate || 0} suffix="%" />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Charts Panel */}
        <Col xs={24} md={16} className="space-y-6">
          <Card title="Income vs Expense Trend" bordered={false} className="shadow-sm">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrendData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#52c41a" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#52c41a" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f5222d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f5222d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip formatter={(val) => `₹${val}`} />
                  <Legend />
                  <Area type="monotone" dataKey="Income" stroke="#52c41a" fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="Expense" stroke="#f5222d" fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Card title="Expense Breakdown" bordered={false} className="shadow-sm">
                <div className="h-64">
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
                      <RechartsTooltip formatter={(val) => `₹${val}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card title="Budget Utilization" bordered={false} className="shadow-sm">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgets?.budgetUtilization || []} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="category" type="category" width={80} />
                      <RechartsTooltip formatter={(val) => `${val}%`} />
                      <Bar dataKey="utilizationPercentage" fill="#1677ff" radius={[0, 4, 4, 0]}>
                        {(budgets?.budgetUtilization || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.utilizationPercentage > 100 ? '#f5222d' : '#1677ff'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Health & Insights Panel */}
        <Col xs={24} md={8} className="space-y-6">
          <Card title="Financial Health Score" bordered={false} className="shadow-sm text-center">
            <Progress 
              type="dashboard" 
              percent={health?.score || 0} 
              strokeColor={{
                '0%': '#f5222d',
                '50%': '#faad14',
                '100%': '#52c41a',
              }}
              format={pct => (
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold">{pct}</span>
                  <span className="text-xs text-gray-500 font-normal">
                    {pct >= 90 ? 'Excellent' : pct >= 70 ? 'Good' : pct >= 50 ? 'Average' : 'Needs Work'}
                  </span>
                </div>
              )}
            />
          </Card>

          <Card title="Insights Engine" bordered={false} className="shadow-sm">
            <div className="space-y-3">
              {insights?.insights?.length === 0 && <Empty description="No insights yet." image={Empty.PRESENTED_IMAGE_SIMPLE} />}
              {insights?.insights?.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <div className="mt-1">{getSeverityIcon(insight.severity)}</div>
                  <span>{insight.message}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Recommendations" bordered={false} className="shadow-sm bg-blue-50/50 dark:bg-blue-900/10">
            <div className="space-y-3">
              {insights?.recommendations?.length === 0 && <Text type="secondary">No specific recommendations.</Text>}
              {insights?.recommendations?.map((rec, idx) => (
                <div key={idx} className="border-l-2 border-blue-400 pl-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-sm">{rec.title}</span>
                    <Tag color={getPriorityColor(rec.priority)}>{rec.priority}</Tag>
                  </div>
                  <Text type="secondary" className="text-xs">{rec.description}</Text>
                </div>
              ))}
            </div>
          </Card>

          <Card title="AI Forecast" bordered={false} className="shadow-sm">
            <div className="flex justify-between items-center text-sm">
              <Text type="secondary">Next Month Est. Expense:</Text>
              <Text strong>₹{forecast?.monthlyExpenseForecast?.forecastValue}</Text>
            </div>
            <div className="flex justify-between items-center text-sm mt-2">
              <Text type="secondary">Confidence:</Text>
              <Tag color="cyan">{forecast?.monthlyExpenseForecast?.confidence}%</Tag>
            </div>
          </Card>
        </Col>
      </Row>

    </div>
  );
};

export default Analytics;
