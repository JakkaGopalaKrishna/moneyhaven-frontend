import React from 'react';
import { Drawer, Descriptions, Tag, Progress, Typography, Alert, Divider } from 'antd';
import dayjs from 'dayjs';
import { formatCurrency } from '../../utils/currencyFormatter';

const { Text, Title } = Typography;

const BudgetDetailsDrawer = ({ visible, budget, daysRemaining, onClose }) => {
  if (!budget) return null;

  const {
    category,
    budgetAmount,
    spentAmount,
    remainingAmount,
    percentageUsed,
    status,
    alertThreshold,
    notes,
    projectedSpending,
    createdAt,
  } = budget;

  const getStatusColor = (statusText) => {
    switch (statusText) {
      case 'Safe': return 'success';
      case 'Warning': return 'warning';
      case 'Exceeded': return 'error';
      default: return 'default';
    }
  };

  const getProgressColor = (pct) => {
    if (pct >= 100) return '#ff4d4f'; // red
    if (pct >= alertThreshold) return '#faad14'; // orange
    return '#52c41a'; // green
  };

  return (
    <Drawer
      title="Budget Details"
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: category?.color || '#ccc' }}
          >
            {/* We could render the icon here if we pass the Icon component or name */}
            <span className="font-bold text-lg">{category?.name?.charAt(0)}</span>
          </div>
          <div>
            <Title level={4} className="!mb-0">{category?.name}</Title>
            <Tag color={getStatusColor(status)} className="mt-1">{status}</Tag>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <Text type="secondary">Budget Usage</Text>
            <Text strong>{percentageUsed}%</Text>
          </div>
          <Progress 
            percent={percentageUsed > 100 ? 100 : percentageUsed} 
            strokeColor={getProgressColor(percentageUsed)}
            showInfo={false}
            size="small"
          />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Spent: {formatCurrency(spentAmount)}</span>
            <span>Total: {formatCurrency(budgetAmount)}</span>
          </div>
        </div>

        {/* Alert Section */}
        {percentageUsed >= alertThreshold && (
          <Alert
            message={percentageUsed >= 100 ? "Budget Exceeded!" : "Approaching Limit"}
            description={percentageUsed >= 100 
              ? `You have exceeded your ${category?.name} budget by ${formatCurrency(spentAmount - budgetAmount)}.`
              : `You have used ${percentageUsed}% of your budget. Your threshold is ${alertThreshold}%.`}
            type={percentageUsed >= 100 ? "error" : "warning"}
            showIcon
          />
        )}

        <Divider className="my-2" />

        {/* Details Section */}
        <Descriptions column={1} size="small" layout="vertical" bordered>
          <Descriptions.Item label="Remaining Budget">
            <Text type={remainingAmount === 0 ? "danger" : "success"} strong>
              {formatCurrency(remainingAmount)}
            </Text>
          </Descriptions.Item>
          
          <Descriptions.Item label="Projected Spending (EOM)">
            <Text type={projectedSpending > budgetAmount ? "danger" : "secondary"}>
              {formatCurrency(projectedSpending)}
            </Text>
            {projectedSpending > budgetAmount && <span className="text-xs text-red-500 ml-2">(Likely to exceed)</span>}
          </Descriptions.Item>

          <Descriptions.Item label="Days Remaining">
            {daysRemaining} days
          </Descriptions.Item>

          <Descriptions.Item label="Alert Threshold">
            {alertThreshold}%
          </Descriptions.Item>

          <Descriptions.Item label="Notes">
            {notes || <Text type="secondary italic">No notes provided.</Text>}
          </Descriptions.Item>

          <Descriptions.Item label="Created At">
            {dayjs(createdAt).format('MMM D, YYYY')}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Drawer>
  );
};

export default BudgetDetailsDrawer;
