import React, { useEffect, useState } from 'react';
import { 
  Row, Col, Typography, Button, Card, Statistic, Progress, Tag, Space, 
  Dropdown, Menu, Empty, Select, Alert, Spin, message, Modal 
} from 'antd';
import { 
  PlusOutlined, TrophyOutlined, AimOutlined, DollarOutlined, 
  EllipsisOutlined, EditOutlined, DeleteOutlined, EyeOutlined,
  CalendarOutlined, RiseOutlined, FireOutlined, WarningOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchGoalProgress, fetchGoalStats, fetchGoalInsights, removeGoal, clearGoalError 
} from '../../store/goalSlice';
import GoalFormModal from './GoalFormModal';
import AddSavingsModal from './AddSavingsModal';
import GoalDetailsDrawer from './GoalDetailsDrawer';
import { formatCurrency } from '../../utils/currencyFormatter';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const Goals = () => {
  const dispatch = useDispatch();
  const { progressData, stats, insights, loading, error } = useSelector((state) => state.goals);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSavingsVisible, setIsSavingsVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const [filterStatus, setFilterStatus] = useState('Active');
  const [filterPriority, setFilterPriority] = useState(undefined);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearGoalError());
    }
  }, [error, dispatch]);

  const loadData = () => {
    dispatch(fetchGoalProgress());
    dispatch(fetchGoalStats());
    dispatch(fetchGoalInsights());
  };

  const handleAddGoal = () => {
    setSelectedGoal(null);
    setIsFormVisible(true);
  };

  const handleEditGoal = (goal) => {
    setSelectedGoal(goal);
    setIsFormVisible(true);
  };

  const handleViewGoal = (goal) => {
    setSelectedGoal(goal);
    setIsDrawerVisible(true);
  };

  const handleAddSavings = (goal) => {
    setSelectedGoal(goal);
    setIsSavingsVisible(true);
  };

  const handleDeleteGoal = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this goal?',
      content: 'This will archive the goal. Your saved amount will remain in your current balance, but the goal tracking will stop.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await dispatch(removeGoal(id)).unwrap();
          message.success('Goal deleted successfully');
          loadData();
        } catch (err) {
          message.error(err || 'Failed to delete goal');
        }
      },
    });
  };

  // Client-side filtering
  let filteredGoals = progressData || [];
  if (filterStatus) {
    filteredGoals = filteredGoals.filter(g => g.status === filterStatus);
  }
  if (filterPriority) {
    filteredGoals = filteredGoals.filter(g => g.priority === filterPriority);
  }

  // Alerts logic
  const completedGoals = filteredGoals.filter(g => g.status === 'Completed');
  const atRiskGoals = filteredGoals.filter(g => g.healthStatus === 'At Risk' || g.healthStatus === 'Overdue');
  const nearingDeadlineGoals = filteredGoals.filter(g => g.daysRemaining <= 14 && g.status === 'Active');

  const getHealthColor = (health) => {
    switch (health) {
      case 'On Track': return '#52c41a'; // green
      case 'At Risk': return '#faad14'; // orange
      case 'Overdue': return '#ff4d4f'; // red
      case 'Completed': return '#1677ff'; // blue
      default: return '#ccc';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Title level={2} className="!mb-1 dark:text-white">Savings Goals</Title>
          <Text className="text-gray-500 dark:text-gray-400">Track and achieve your financial targets.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddGoal} size="large">
          Create Goal
        </Button>
      </div>

      {/* Alerts */}
      <div className="space-y-2">
        {completedGoals.length > 0 && (
          <Alert 
            message="Goal Achieved!" 
            description={`You have successfully completed ${completedGoals.length} goal(s). Great job!`} 
            type="success" showIcon 
            closable
          />
        )}
        {atRiskGoals.length > 0 && (
          <Alert 
            message="Goals At Risk" 
            description={`You have ${atRiskGoals.length} goal(s) falling behind schedule or overdue.`} 
            type="error" showIcon 
            closable
          />
        )}
        {nearingDeadlineGoals.length > 0 && (
          <Alert 
            message="Deadline Approaching" 
            description={`You have ${nearingDeadlineGoals.length} goal(s) with less than two weeks remaining.`} 
            type="warning" showIcon 
            closable
          />
        )}
      </div>

      {/* Stats Dashboard */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Total Active Goals" value={stats?.activeGoals || 0} prefix={<AimOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Total Target" value={stats?.totalTargetAmount || 0} prefix="₹" />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Total Saved" value={stats?.totalSavedAmount || 0} prefix="₹" valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Overall Progress" value={stats?.overallProgress || 0} prefix={<RiseOutlined />} suffix="%" valueStyle={{ color: '#1677ff' }} />
          </Card>
        </Col>
      </Row>

      {/* Insights Section */}
      {insights && (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card bordered={false} className="shadow-sm bg-orange-50 dark:bg-orange-900/20 h-full">
              <Statistic 
                title={<span className="text-orange-700 dark:text-orange-400">Nearest Deadline</span>}
                value={insights.nearestGoal?.title || 'N/A'} 
                prefix={<CalendarOutlined />} 
                suffix={insights.nearestGoal ? `(${dayjs(insights.nearestGoal.targetDate).format('MMM D')})` : ''}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card bordered={false} className="shadow-sm bg-red-50 dark:bg-red-900/20 h-full">
              <Statistic 
                title={<span className="text-red-700 dark:text-red-400">Highest Priority</span>}
                value={insights.highestPriorityGoal?.title || 'N/A'} 
                prefix={<FireOutlined />} 
                suffix={insights.highestPriorityGoal ? `(${insights.highestPriorityGoal.priority})` : ''}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card bordered={false} className="shadow-sm bg-green-50 dark:bg-green-900/20 h-full">
              <Statistic 
                title={<span className="text-green-700 dark:text-green-400">Most Funded</span>}
                value={insights.mostFundedGoal?.title || 'N/A'} 
                prefix={<DollarOutlined />} 
                suffix={insights.mostFundedGoal ? `(${insights.mostFundedGoal.progress}%)` : ''}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-[#1f1f1f] p-4 rounded-lg shadow-sm space-y-4">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Select
              className="w-full"
              value={filterStatus}
              onChange={(val) => setFilterStatus(val)}
              placeholder="Filter by Status"
            >
              <Option value={null}>All Statuses</Option>
              <Option value="Active">Active</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Select
              className="w-full"
              value={filterPriority}
              onChange={(val) => setFilterPriority(val)}
              allowClear
              placeholder="Filter by Priority"
            >
              <Option value="High">High Priority</Option>
              <Option value="Medium">Medium Priority</Option>
              <Option value="Low">Low Priority</Option>
            </Select>
          </Col>
        </Row>
      </div>

      {/* Goal Cards Grid */}
      {loading && progressData.length === 0 ? (
        <div className="flex justify-center p-12"><Spin size="large" /></div>
      ) : filteredGoals.length === 0 ? (
        <Card className="text-center py-12 dark:bg-[#1f1f1f] dark:border-gray-800">
          <Empty description="No goals found matching your criteria" />
          <Button type="primary" className="mt-4" onClick={handleAddGoal}>Create a Goal</Button>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredGoals.map(goal => (
            <Col xs={24} sm={12} lg={8} key={goal._id}>
              <Card 
                hoverable 
                className={`h-full shadow-sm ${goal.status === 'Completed' ? 'border-green-200 bg-green-50/30' : ''}`}
                actions={[
                  <Button type="text" icon={<PlusOutlined />} onClick={() => handleAddSavings(goal)} disabled={goal.status === 'Completed'}>Add Savings</Button>,
                  <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewGoal(goal)}>Details</Button>,
                ]}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Title level={5} className="!mb-0 truncate pr-2" title={goal.title}>{goal.title}</Title>
                    <Text type="secondary" className="text-xs">{goal.category}</Text>
                  </div>
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => handleEditGoal(goal)} disabled={goal.status === 'Completed'}>Edit</Menu.Item>
                        <Menu.Item key="delete" danger icon={<DeleteOutlined />} onClick={() => handleDeleteGoal(goal._id)}>Delete</Menu.Item>
                      </Menu>
                    }
                    trigger={['click']}
                  >
                    <Button type="text" icon={<EllipsisOutlined />} />
                  </Dropdown>
                </div>

                <div className="flex justify-center mb-4">
                  <Progress 
                    type="dashboard" 
                    percent={goal.progressPercentage} 
                    strokeColor={getHealthColor(goal.healthStatus)}
                    format={pct => (
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold">{pct}%</span>
                        <span className="text-xs text-gray-500 font-normal">{goal.healthStatus}</span>
                      </div>
                    )}
                  />
                </div>

                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <Text type="secondary">Saved:</Text>
                    <Text strong className="text-green-600">{formatCurrency(goal.savedAmount)}</Text>
                  </div>
                  <div className="flex justify-between text-sm">
                    <Text type="secondary">Target:</Text>
                    <Text strong>{formatCurrency(goal.targetAmount)}</Text>
                  </div>
                  <div className="flex justify-between text-sm">
                    <Text type="secondary">Remaining:</Text>
                    <Text strong>{formatCurrency(goal.remainingAmount)}</Text>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs">
                    <Space>
                      <CalendarOutlined className="text-gray-400" />
                      <Text type="secondary">{dayjs(goal.targetDate).format('MMM D, YYYY')}</Text>
                    </Space>
                    <Tag color={goal.daysRemaining <= 14 && goal.status === 'Active' ? 'error' : 'default'} bordered={false}>
                      {goal.status === 'Completed' ? 'Achieved' : `${goal.daysRemaining} days left`}
                    </Tag>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modals */}
      <GoalFormModal
        visible={isFormVisible}
        goal={selectedGoal}
        onClose={() => setIsFormVisible(false)}
        onSuccess={() => loadData()}
      />

      <AddSavingsModal
        visible={isSavingsVisible}
        goal={selectedGoal}
        onClose={() => setIsSavingsVisible(false)}
        onSuccess={() => loadData()}
      />

      <GoalDetailsDrawer
        visible={isDrawerVisible}
        goalId={selectedGoal?._id}
        onClose={() => setIsDrawerVisible(false)}
      />
    </div>
  );
};

export default Goals;
