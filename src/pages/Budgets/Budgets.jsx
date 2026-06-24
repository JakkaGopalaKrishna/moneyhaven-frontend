import React, { useEffect, useState } from 'react';
import { 
  Table, Button, Space, Tag, Modal, message, Select, Row, Col, Typography, Card, Statistic, Progress, Alert 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, DashboardOutlined, 
  FallOutlined, RiseOutlined, HeartOutlined, WarningOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchBudgetProgress, fetchBudgetStats, removeBudget, clearBudgetError 
} from '../../store/budgetSlice';
import BudgetFormModal from './BudgetFormModal';
import BudgetDetailsDrawer from './BudgetDetailsDrawer';
import { formatCurrency } from '../../utils/currencyFormatter';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const Budgets = () => {
  const dispatch = useDispatch();
  const { progressData, stats, loading, error } = useSelector((state) => state.budgets);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  const [filterMonth, setFilterMonth] = useState(dayjs().month() + 1);
  const [filterYear, setFilterYear] = useState(dayjs().year());
  const [filterStatus, setFilterStatus] = useState(undefined);

  useEffect(() => {
    loadData();
  }, [filterMonth, filterYear]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearBudgetError());
    }
  }, [error, dispatch]);

  const loadData = () => {
    dispatch(fetchBudgetProgress({ month: filterMonth, year: filterYear }));
    dispatch(fetchBudgetStats({ month: filterMonth, year: filterYear }));
  };

  const handleAdd = () => {
    setSelectedBudget(null);
    setIsFormVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedBudget(record);
    setIsFormVisible(true);
  };

  const handleView = (record) => {
    setSelectedBudget(record);
    setIsDrawerVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this budget?',
      content: 'This will remove the budget limits for this category.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await dispatch(removeBudget(id)).unwrap();
          message.success('Budget deleted successfully');
          loadData();
        } catch (err) {
          message.error(err || 'Failed to delete budget');
        }
      },
    });
  };

  // Client-side filtering for status
  let filteredBudgets = progressData?.budgets || [];
  if (filterStatus) {
    filteredBudgets = filteredBudgets.filter(b => b.status === filterStatus);
  }

  // Get active alerts (budgets >= alertThreshold)
  const activeAlerts = filteredBudgets.filter(b => b.percentageUsed >= b.alertThreshold);

  const getStatusColor = (statusText) => {
    switch (statusText) {
      case 'Safe': return 'success';
      case 'Warning': return 'warning';
      case 'Exceeded': return 'error';
      default: return 'default';
    }
  };

  const getProgressColor = (pct, threshold) => {
    if (pct >= 100) return '#ff4d4f'; // red
    if (pct >= threshold) return '#faad14'; // orange
    return '#52c41a'; // green
  };

  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Space>
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
            style={{ backgroundColor: category?.color || '#ccc' }}
          >
            {category?.name?.charAt(0)}
          </div>
          <Text strong>{category?.name}</Text>
        </Space>
      ),
    },
    {
      title: 'Budget',
      dataIndex: 'budgetAmount',
      key: 'budgetAmount',
      render: (amt) => formatCurrency(amt),
      sorter: (a, b) => a.budgetAmount - b.budgetAmount,
    },
    {
      title: 'Spent',
      dataIndex: 'spentAmount',
      key: 'spentAmount',
      render: (amt) => formatCurrency(amt),
      sorter: (a, b) => a.spentAmount - b.spentAmount,
    },
    {
      title: 'Remaining',
      dataIndex: 'remainingAmount',
      key: 'remainingAmount',
      render: (amt) => formatCurrency(amt),
    },
    {
      title: 'Usage',
      key: 'usage',
      render: (_, record) => (
        <div style={{ width: 150 }}>
          <Progress 
            percent={record.percentageUsed > 100 ? 100 : record.percentageUsed} 
            strokeColor={getProgressColor(record.percentageUsed, record.alertThreshold)}
            size="small"
            format={() => `${record.percentageUsed}%`}
          />
        </div>
      ),
      sorter: (a, b) => a.percentageUsed - b.percentageUsed,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} />
        </Space>
      ),
    },
  ];

  const currentYear = dayjs().year();
  const years = [currentYear - 1, currentYear, currentYear + 1];
  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' },
    { value: 3, label: 'March' }, { value: 4, label: 'April' },
    { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' },
    { value: 9, label: 'September' }, { value: 10, label: 'October' },
    { value: 11, label: 'November' }, { value: 12, label: 'December' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Title level={2} className="!mb-1 dark:text-white">Budgets</Title>
          <Text className="text-gray-500 dark:text-gray-400">Track and manage your category spending limits.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
          Create Budget
        </Button>
      </div>

      {/* Alerts Section */}
      {activeAlerts.length > 0 && (
        <div className="space-y-2">
          {activeAlerts.map(alert => (
            <Alert
              key={alert._id}
              message={alert.percentageUsed >= 100 ? `Budget Exceeded: ${alert.category.name}` : `Approaching Limit: ${alert.category.name}`}
              description={`You have used ${alert.percentageUsed}% of your budget for ${alert.category.name}.`}
              type={alert.percentageUsed >= 100 ? "error" : "warning"}
              showIcon
              icon={<WarningOutlined />}
              closable
            />
          ))}
        </div>
      )}

      {/* Stats Dashboard */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Total Budgets" value={stats?.totalBudgets || 0} prefix={<DashboardOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Budgeted Amount" value={stats?.totalBudgetAmount || 0} prefix="₹" />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Total Spending" value={stats?.totalSpending || 0} prefix="₹" valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Remaining" value={stats?.remainingBudget || 0} prefix="₹" valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
      </Row>

      {/* Insights Section */}
      {progressData?.insights && (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card bordered={false} className="shadow-sm bg-red-50 dark:bg-red-900/20 h-full">
              <Statistic 
                title={<span className="text-red-700 dark:text-red-400">Most Overspent</span>}
                value={progressData.insights.topOverspentCategory?.category?.name || 'N/A'} 
                prefix={<FallOutlined />} 
                suffix={progressData.insights.topOverspentCategory ? `(${progressData.insights.topOverspentCategory.percentageUsed}%)` : ''}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card bordered={false} className="shadow-sm bg-green-50 dark:bg-green-900/20 h-full">
              <Statistic 
                title={<span className="text-green-700 dark:text-green-400">Most Underutilized</span>}
                value={progressData.insights.topUnderutilizedCategory?.category?.name || 'N/A'} 
                prefix={<RiseOutlined />} 
                suffix={progressData.insights.topUnderutilizedCategory ? `(${progressData.insights.topUnderutilizedCategory.percentageUsed}%)` : ''}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card bordered={false} className="shadow-sm bg-blue-50 dark:bg-blue-900/20 h-full">
              <Statistic 
                title={<span className="text-blue-700 dark:text-blue-400">Budget Health Score</span>}
                value={progressData.insights.budgetHealthScore || 100} 
                prefix={<HeartOutlined />} 
                suffix="/ 100"
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters Section */}
      <div className="bg-white dark:bg-[#1f1f1f] p-4 rounded-lg shadow-sm space-y-4">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Select
              className="w-full"
              value={filterMonth}
              onChange={(val) => setFilterMonth(val)}
            >
              {months.map(m => <Option key={m.value} value={m.value}>{m.label}</Option>)}
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Select
              className="w-full"
              value={filterYear}
              onChange={(val) => setFilterYear(val)}
            >
              {years.map(y => <Option key={y} value={y}>{y}</Option>)}
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Select
              className="w-full"
              placeholder="Filter by Status"
              allowClear
              onChange={(val) => setFilterStatus(val)}
            >
              <Option value="Safe">Safe</Option>
              <Option value="Warning">Warning</Option>
              <Option value="Exceeded">Exceeded</Option>
            </Select>
          </Col>
        </Row>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <Text strong>Period: {progressData?.periodStatus} ({progressData?.daysRemaining} days remaining)</Text>
        </div>
        <Table
          columns={columns}
          dataSource={filteredBudgets}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
          locale={{
            emptyText: (
              <div className="py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No budgets found for this period.</p>
                <Button type="primary" onClick={handleAdd}>Create your first budget</Button>
              </div>
            )
          }}
        />
      </div>

      <BudgetFormModal
        visible={isFormVisible}
        budget={selectedBudget}
        onClose={() => setIsFormVisible(false)}
        onSuccess={() => loadData()}
      />

      <BudgetDetailsDrawer
        visible={isDrawerVisible}
        budget={selectedBudget}
        daysRemaining={progressData?.daysRemaining}
        onClose={() => setIsDrawerVisible(false)}
      />
    </div>
  );
};

export default Budgets;
