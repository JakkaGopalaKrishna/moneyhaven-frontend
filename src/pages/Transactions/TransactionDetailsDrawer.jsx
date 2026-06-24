import React from 'react';
import { Drawer, Descriptions, Tag, Typography } from 'antd';
import { formatCurrency } from '../../utils/currencyFormatter';
import { CATEGORY_COLORS, TRANSACTION_TYPES } from '../../constants/transactions';

const { Text } = Typography;

const TransactionDetailsDrawer = ({ visible, transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <Drawer
      title="Transaction Details"
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
    >
      <Descriptions column={1} bordered size="small" layout="vertical">
        <Descriptions.Item label="Transaction ID">
          <Text copyable>{transaction.transactionId}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Title">
          <Text strong>{transaction.title}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Amount">
          <Text 
            strong 
            type={transaction.type === TRANSACTION_TYPES.INCOME ? 'success' : 'danger'}
            className="text-lg"
          >
            {transaction.type === TRANSACTION_TYPES.INCOME ? '+' : '-'} {formatCurrency(transaction.amount)}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label="Type">
          <Tag color={transaction.type === TRANSACTION_TYPES.INCOME ? 'green' : 'red'}>
            {transaction.type.toUpperCase()}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Category">
          {transaction.categoryId ? (
            <Tag color={transaction.categoryId.color || 'default'}>
              {transaction.categoryId.name}
            </Tag>
          ) : (
            <Tag>{transaction.categoryNameSnapshot}</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Payment Method">
          {transaction.paymentMethod}
        </Descriptions.Item>
        <Descriptions.Item label="Date">
          {new Date(transaction.transactionDate).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })}
        </Descriptions.Item>
        <Descriptions.Item label="Description">
          {transaction.description || 'No description provided.'}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default TransactionDetailsDrawer;
