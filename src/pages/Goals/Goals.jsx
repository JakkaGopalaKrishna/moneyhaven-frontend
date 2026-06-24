import React, { useEffect, useState } from 'react';
import { 
  Row, Col, Typography, Button, Statistic, Progress, Tag, Space, 
  Dropdown, Menu, Select, Alert, Spin, message, Modal 
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
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import EmptyState from '../../components/common/EmptyState';

const { Text } = Typography;
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader 
        title="Savings Goals" 
        subtitle="Track and achieve your financial targets."
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddGoal} size="large" className="rounded-full px-6">
            Create Goal
          </Button>
        }
      />

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
      <Row gutter={[24, 24]}>
        <Col xs={12} sm={6}>
          <SectionCard>
            <Statistic title="Total Active Goals" value={stats?.activeGoals || 0} prefix={<AimOutlined />} />
          </SectionCard>
        </Col>
        <Col xs={12} sm={6}>
          <SectionCard>
            <Statistic title="Total Target" value={stats?.totalTargetAmount || 0} prefix="₹" />
          </SectionCard>
        </Col>
        <Col xs={12} sm={6}>
          <SectionCard>
            <Statistic title="Total Saved" value={stats?.totalSavedAmount || 0} prefix="₹" valueStyle={{ color: '#22c55e' }} />
          </SectionCard>
        </Col>
        <Col xs={12} sm={6}>
          <SectionCard>
            <Statistic title="Overall Progress" value={stats?.overallProgress || 0} prefix={<RiseOutlined />} suffix="%" valueStyle={{ color: '#3b82f6' }} />
          </SectionCard>
        </Col>
      </Row>

      {/* Insights Section */}
      {insights && (
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <SectionCard className="bg-orange-50 dark:bg-fintech-warning/10 border-orange-100 dark:border-fintech-warning/20">
              <Statistic 
                title={<span className="text-orange-700 dark:text-orange-400 font-medium">Nearest Deadline</span>}
                value={insights.nearestGoal?.title || 'N/A'} 
                prefix={<CalendarOutlined />} 
                suffix={insights.nearestGoal ? `(${dayjs(insights.nearestGoal.targetDate).format('MMM D')})` : ''}
              />
            </SectionCard>
          </Col>
          <Col xs={24} md={8}>
            <SectionCard className="bg-red-50 dark:bg-fintech-danger/10 border-red-100 dark:border-fintech-danger/20">
              <Statistic 
                title={<span className="text-red-700 dark:text-red-400 font-medium">Highest Priority</span>}
                value={insights.highestPriorityGoal?.title || 'N/A'} 
                prefix={<FireOutlined />} 
                suffix={insights.highestPriorityGoal ? `(${insights.highestPriorityGoal.priority})` : ''}
              />
            </SectionCard>
          </Col>
          <Col xs={24} md={8}>
            <SectionCard className="bg-green-50 dark:bg-fintech-success/10 border-green-100 dark:border-fintech-success/20">
              <Statistic 
                title={<span className="text-green-700 dark:text-green-400 font-medium">Most Funded</span>}
                value={insights.mostFundedGoal?.title || 'N/A'} 
                prefix={<DollarOutlined />} 
                suffix={insights.mostFundedGoal ? `(${insights.mostFundedGoal.progress}%)` : ''}
              />
            </SectionCard>
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
        <EmptyState 
          title="No goals found" 
          description="Try adjusting your filters or create a new goal." 
          action={<Button type="primary" onClick={handleAddGoal}>Create a Goal</Button>}
        />
      ) : (
        <Row gutter={[24, 24]}>
          {filteredGoals.map(goal => (
            <Col xs={24} sm={12} lg={8} key={goal._id}>
              <SectionCard 
                className={`${goal.status === 'Completed' ? 'border-green-200 bg-green-50/30' : ''}`}
                actions={[
                  <Button type="text" icon={<PlusOutlined />} onClick={() => handleAddSavings(goal)} disabled={goal.status === 'Completed'}>Add Savings</Button>,
                  <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewGoal(goal)}>Details</Button>,
                ]}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-lg font-semibold truncate pr-2 dark:text-white" title={goal.title}>{goal.title}</div>
                    <Text className="text-fintech-textMuted text-xs">{goal.category}</Text>
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
                        <span className="text-lg font-bold dark:text-white">{pct}%</span>
                        <span className="text-xs text-fintech-textMuted font-normal">{goal.healthStatus}</span>
                      </div>
                    )}
                  />
                </div>

                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <Text className="text-fintech-textMuted">Saved:</Text>
                    <Text className="text-fintech-success font-semibold">{formatCurrency(goal.savedAmount)}</Text>
                  </div>
                  <div className="flex justify-between text-sm">
                    <Text className="text-fintech-textMuted">Target:</Text>
                    <Text className="font-semibold dark:text-white">{formatCurrency(goal.targetAmount)}</Text>
                  </div>
                  <div className="flex justify-between text-sm">
                    <Text className="text-fintech-textMuted">Remaining:</Text>
                    <Text className="font-semibold dark:text-white">{formatCurrency(goal.remainingAmount)}</Text>
                  </div>
                  
                  <div className="pt-3 border-t border-fintech-border/50 flex justify-between items-center text-xs mt-3">
                    <Space>
                      <CalendarOutlined className="text-fintech-textMuted" />
                      <Text className="text-fintech-textMuted">{dayjs(goal.targetDate).format('MMM D, YYYY')}</Text>
                    </Space>
                    <Tag color={goal.daysRemaining <= 14 && goal.status === 'Active' ? 'error' : 'default'} bordered={false}>
                      {goal.status === 'Completed' ? 'Achieved' : `${goal.daysRemaining} days left`}
                    </Tag>
                  </div>
                </div>
              </SectionCard>
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
