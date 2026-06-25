import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAsRead, markAllAsRead, archiveNotification } from '../../store/notificationSlice';
import { 
  Typography, List, Button, Tag, Space, Tabs, Empty, 
  Tooltip, Badge, Dropdown, Menu
} from 'antd';
import { 
  CheckCircleOutlined, DeleteOutlined, InfoCircleOutlined, 
  WarningOutlined, CloseCircleOutlined, SyncOutlined, SettingOutlined,
  CheckOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';

dayjs.extend(relativeTime);

const { Text } = Typography;
const { TabPane } = Tabs;

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, loading } = useSelector(state => state.notifications);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchNotifications(filter === 'all' ? '' : filter));
  }, [dispatch, filter]);

  const handleMarkAsRead = (e, id) => {
    e.stopPropagation();
    dispatch(markAsRead(id));
  };

  const handleArchive = (e, id) => {
    e.stopPropagation();
    dispatch(archiveNotification(id));
  };

  const handleDeepLink = (url, id, isRead) => {
    if (!isRead) dispatch(markAsRead(id));
    if (url) navigate(url);
  };

  const getIcon = (severity) => {
    switch(severity) {
      case 'Info': return <InfoCircleOutlined className="text-blue-500 text-xl" />;
      case 'Warning': return <WarningOutlined className="text-orange-500 text-xl" />;
      case 'Critical': return <CloseCircleOutlined className="text-red-500 text-xl" />;
      case 'Success': return <CheckCircleOutlined className="text-green-500 text-xl" />;
      default: return <InfoCircleOutlined className="text-gray-500 text-xl" />;
    }
  };

  const getPriorityTag = (priority) => {
    let color = 'default';
    if (priority === 'Critical') color = 'red';
    else if (priority === 'High') color = 'orange';
    else if (priority === 'Medium') color = 'blue';
    return <Tag color={color} className="text-[10px]">{priority}</Tag>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Notification Center" 
        subtitle="Stay up to date with your financial activity."
        actions={
          <Space>
            <Button 
              icon={<CheckOutlined />} 
              onClick={() => dispatch(markAllAsRead())}
            >
              Mark All Read
            </Button>
            <Button 
              icon={<SettingOutlined />} 
              onClick={() => navigate('/notifications/settings')}
            >
              Settings
            </Button>
          </Space>
        }
      />

      <SectionCard className="p-2">
        <Tabs activeKey={filter} onChange={setFilter}>
          <TabPane tab="All" key="all" />
          <TabPane tab="Unread" key="unread" />
          <TabPane tab="Warnings" key="warning" />
          <TabPane tab="Critical" key="critical" />
        </Tabs>

        <List
          loading={loading && notifications.length === 0}
          itemLayout="horizontal"
          dataSource={notifications}
          locale={{ emptyText: <Empty description="No notifications found" /> }}
          renderItem={(item) => (
            <List.Item
              className={`p-3 md:p-4 mb-2 md:mb-3 rounded-xl md:rounded-lg cursor-pointer transition-colors border shadow-sm md:shadow-none ${
                item.isRead ? 'bg-white border-gray-100 hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-750' 
                  : 'bg-blue-50 border-blue-100 hover:bg-blue-100 dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-slate-600'
              }`}
              onClick={() => handleDeepLink(item.actionUrl, item._id, item.isRead)}
              actions={[
                !item.isRead && (
                  <Tooltip title="Mark as read" key="read">
                    <Button type="text" shape="circle" size="small" className="md:w-8 md:h-8" icon={<CheckOutlined />} onClick={(e) => handleMarkAsRead(e, item._id)} />
                  </Tooltip>
                ),
                <Tooltip title="Archive" key="archive">
                  <Button type="text" shape="circle" size="small" danger className="md:w-8 md:h-8" icon={<DeleteOutlined />} onClick={(e) => handleArchive(e, item._id)} />
                </Tooltip>
              ].filter(Boolean)}
            >
              <List.Item.Meta
                avatar={<div className="mt-1 md:mt-2 text-lg md:text-xl pl-2 md:pl-3">{getIcon(item.severity)}</div>}
                title={
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full gap-1 md:gap-0">
                    <span className={`font-semibold text-sm md:text-base pr-2 ${!item.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                      {item.title}
                    </span>
                    <div className="flex items-center justify-between md:justify-end space-x-2">
                      {getPriorityTag(item.priority)}
                      <Text type="secondary" className="text-[10px] md:text-xs">{dayjs(item.createdAt).fromNow()}</Text>
                    </div>
                  </div>
                }
                description={
                  <div className="mt-1">
                    <Text className={`line-clamp-2 text-xs md:text-sm ${!item.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                      {item.message}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </SectionCard>
    </div>
  );
};

export default Notifications;
