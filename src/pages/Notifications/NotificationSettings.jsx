import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPreferences, updatePreferences } from '../../store/notificationSlice';
import { Card, Typography, Switch, List, message, Skeleton } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const NotificationSettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { preferences, loading } = useSelector(state => state.notifications);

  useEffect(() => {
    dispatch(fetchPreferences());
  }, [dispatch]);

  const handleToggle = async (key, checked) => {
    try {
      await dispatch(updatePreferences({ [key]: checked })).unwrap();
      message.success('Preferences updated successfully');
    } catch (err) {
      message.error(err || 'Failed to update preferences');
    }
  };

  if (loading && !preferences) {
    return <div className="max-w-2xl mx-auto py-6 px-4"><Skeleton active /></div>;
  }

  const settingsData = [
    {
      key: 'budgetAlerts',
      title: 'Budget Alerts',
      description: 'Receive warnings when you are close to or exceed your budget limits.',
    },
    {
      key: 'goalAlerts',
      title: 'Savings Goal Reminders',
      description: 'Receive notifications about approaching deadlines and goal completions.',
    },
    {
      key: 'financialHealthAlerts',
      title: 'Financial Health Alerts',
      description: 'Get notified if your financial health score drops to a critical level.',
    },
    {
      key: 'reportNotifications',
      title: 'Scheduled Reports',
      description: 'Get notified when your automated reports are ready to view and download.',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center space-x-4 mb-6 cursor-pointer" onClick={() => navigate('/notifications')}>
        <ArrowLeftOutlined className="text-lg text-gray-500" />
        <Title level={3} className="!mb-0 dark:text-white">Notification Preferences</Title>
      </div>

      <Card className="shadow-sm">
        <List
          itemLayout="horizontal"
          dataSource={settingsData}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Switch 
                  checked={preferences?.[item.key]} 
                  onChange={(checked) => handleToggle(item.key, checked)} 
                />
              ]}
            >
              <List.Item.Meta
                title={<span className="font-medium dark:text-white">{item.title}</span>}
                description={<Text type="secondary">{item.description}</Text>}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default NotificationSettings;
