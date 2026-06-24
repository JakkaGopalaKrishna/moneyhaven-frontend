import React, { useEffect, useState } from 'react';
import { Drawer, Descriptions, Tag, Progress, Typography, Table, Steps, Divider, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGoalById, clearCurrentGoalDetails } from '../../store/goalSlice';
import { formatCurrency } from '../../utils/currencyFormatter';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

const GoalDetailsDrawer = ({ visible, goalId, onClose }) => {
  const dispatch = useDispatch();
  const { currentGoalDetails, progressData, loading } = useSelector((state) => state.goals);
  
  // Local state to store running total for the table
  const [historyWithRunningTotal, setHistoryWithRunningTotal] = useState([]);

  // Find the progress data matching this goal for health/forecast
  const goalProgress = progressData.find(g => g._id === goalId);

  useEffect(() => {
    if (visible && goalId) {
      dispatch(fetchGoalById(goalId));
    } else {
      dispatch(clearCurrentGoalDetails());
      setHistoryWithRunningTotal([]);
    }
  }, [visible, goalId, dispatch]);

  useEffect(() => {
    if (currentGoalDetails && currentGoalDetails.contributions) {
      let running = 0;
      // Reverse to calculate from oldest to newest, then reverse back for table
      const sortedHistory = [...currentGoalDetails.contributions].sort((a, b) => new Date(a.contributionDate) - new Date(b.contributionDate));
      
      const computed = sortedHistory.map(c => {
        running += c.amount;
        return {
          ...c,
          runningTotal: running
        };
      });
      
      setHistoryWithRunningTotal(computed.reverse()); // latest first
    }
  }, [currentGoalDetails]);

  if (!visible) return null;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'red';
      case 'Medium': return 'orange';
      case 'Low': return 'green';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Active': return 'processing';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'On Track': return '#52c41a'; // green
      case 'At Risk': return '#faad14'; // orange
      case 'Overdue': return '#ff4d4f'; // red
      case 'Completed': return '#1677ff'; // blue
      default: return '#ccc';
    }
  };

  const currentPercent = goalProgress ? goalProgress.progressPercentage : 0;
  
  let currentMilestone = 0; // 0, 1, 2, 3, 4
  if (currentPercent >= 100) currentMilestone = 4;
  else if (currentPercent >= 75) currentMilestone = 3;
  else if (currentPercent >= 50) currentMilestone = 2;
  else if (currentPercent >= 25) currentMilestone = 1;

  const historyColumns = [
    {
      title: 'Date',
      dataIndex: 'contributionDate',
      key: 'contributionDate',
      render: (date) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <Text type="success">+{formatCurrency(amount)}</Text>,
    },
    {
      title: 'Running Total',
      dataIndex: 'runningTotal',
      key: 'runningTotal',
      render: (total) => formatCurrency(total),
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      render: (note) => note || '-',
    },
  ];

  return (
    <Drawer
      title="Savings Goal Details"
      placement="right"
      onClose={onClose}
      open={visible}
      width={500}
    >
      {loading && !currentGoalDetails ? (
        <div className="flex justify-center p-8"><Spin /></div>
      ) : currentGoalDetails ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <Title level={4} className="!mb-1">{currentGoalDetails.title}</Title>
              <div className="flex gap-2">
                <Tag color={getStatusColor(currentGoalDetails.status)}>{currentGoalDetails.status}</Tag>
                <Tag color={getPriorityColor(currentGoalDetails.priority)}>{currentGoalDetails.priority} Priority</Tag>
              </div>
            </div>
            {goalProgress && (
              <div className="text-right">
                <Text type="secondary" className="block text-xs">Health</Text>
                <Text strong style={{ color: getHealthColor(goalProgress.healthStatus) }}>
                  {goalProgress.healthStatus}
                </Text>
              </div>
            )}
          </div>

          {/* Progress Overview */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex gap-4 items-center">
            <Progress 
              type="circle" 
              percent={currentPercent} 
              width={80}
              strokeColor={getHealthColor(goalProgress?.healthStatus)}
            />
            <div className="flex-1">
              <div className="flex justify-between">
                <Text type="secondary">Target Amount</Text>
                <Text strong>{formatCurrency(currentGoalDetails.targetAmount)}</Text>
              </div>
              <div className="flex justify-between mt-1">
                <Text type="secondary">Saved So Far</Text>
                <Text strong className="text-green-600 dark:text-green-400">{formatCurrency(currentGoalDetails.savedAmount)}</Text>
              </div>
              <div className="flex justify-between mt-1">
                <Text type="secondary">Remaining</Text>
                <Text strong>{formatCurrency(Math.max(0, currentGoalDetails.targetAmount - currentGoalDetails.savedAmount))}</Text>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div>
            <Text strong className="mb-4 block dark:text-gray-300">Milestones</Text>
            <Steps 
              size="small" 
              current={currentMilestone}
              items={[
                { title: 'Start' },
                { title: '25%' },
                { title: '50%' },
                { title: '75%' },
                { title: 'Goal Met' }
              ]}
            />
          </div>

          <Divider />

          {/* Forecasting */}
          {goalProgress && currentGoalDetails.status === 'Active' && (
            <Descriptions column={1} size="small" layout="vertical" bordered title="Forecast & Target">
              <Descriptions.Item label="Target Date">
                <Text strong>{dayjs(currentGoalDetails.targetDate).format('MMM D, YYYY')}</Text>
                <Text type="secondary" className="ml-2">({goalProgress.daysRemaining} days left)</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Required Daily Savings">
                {formatCurrency(goalProgress.forecast.requiredDaily)} / day
              </Descriptions.Item>
              <Descriptions.Item label="Required Weekly Savings">
                {formatCurrency(goalProgress.forecast.requiredWeekly)} / week
              </Descriptions.Item>
              <Descriptions.Item label="Required Monthly Savings">
                {formatCurrency(goalProgress.forecast.requiredMonthly)} / month
              </Descriptions.Item>
            </Descriptions>
          )}

          {currentGoalDetails.status === 'Completed' && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
              <Title level={5} className="text-green-700 dark:text-green-400 !mb-0">
                🎉 Goal Achieved on {dayjs(currentGoalDetails.completedAt).format('MMM D, YYYY')}
              </Title>
            </div>
          )}

          <Divider />

          {/* History */}
          <div>
            <Text strong className="mb-4 block dark:text-gray-300">Contribution History</Text>
            <Table
              columns={historyColumns}
              dataSource={historyWithRunningTotal}
              rowKey="_id"
              size="small"
              pagination={{ pageSize: 5 }}
            />
          </div>
        </div>
      ) : (
        <Text>Error loading goal details.</Text>
      )}
    </Drawer>
  );
};

export default GoalDetailsDrawer;
