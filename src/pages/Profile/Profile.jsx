import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, Form, Input, Button, Upload, Progress, Statistic, Row, Col, message, Popconfirm, Avatar, Badge } from 'antd';
import { UserOutlined, UploadOutlined, DeleteOutlined, CheckCircleOutlined, SafetyCertificateFilled } from '@ant-design/icons';
import { updateProfileUser, uploadAvatarUser, deleteAvatarUser, changePasswordUser } from '../../store/profileSlice';
import { getDashboardSummaryUser } from '../../store/dashboardSlice';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.profile);
  const { summary } = useSelector((state) => state.dashboard);
  
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  
  const baseURL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
  const avatarUrl = user?.avatar 
    ? (user.avatar.startsWith('http') ? user.avatar : `${baseURL}${user.avatar}`) 
    : null;

  useEffect(() => {
    dispatch(getDashboardSummaryUser());
    if (user) {
      profileForm.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        openingBalance: user.openingBalance,
      });
    }
  }, [user, profileForm, dispatch]);

  const handleProfileUpdate = async (values) => {
    try {
      await dispatch(updateProfileUser(values)).unwrap();
      message.success('Profile updated successfully');
    } catch (error) {
      message.error(error || 'Update failed');
    }
  };

  const handlePasswordChange = async (values) => {
    try {
      await dispatch(changePasswordUser({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })).unwrap();
      message.success('Password changed successfully');
      passwordForm.resetFields();
    } catch (error) {
      message.error(error || 'Invalid password');
    }
  };

  const handleAvatarUpload = async (info) => {
    const file = info.file.originFileObj || info.file;
    if (!file) return;

    // Optional Frontend Validation for size
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must smaller than 5MB!');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      await dispatch(uploadAvatarUser(formData)).unwrap();
      message.success('Avatar uploaded successfully');
    } catch (error) {
      message.error(error || 'Upload failed');
    }
  };

  const handleAvatarDelete = async () => {
    try {
      await dispatch(deleteAvatarUser()).unwrap();
      message.success('Avatar deleted successfully');
    } catch (error) {
      message.error(error || 'Delete failed');
    }
  };

  // Profile Completion Calculation
  let completion = 0;
  if (user?.firstName && user?.lastName) completion += 40;
  if (user?.isVerified) completion += 30;
  if (user?.avatar) completion += 30;

  const overviewContent = (
    <div className="space-y-6">
      <SectionCard title="Profile Completion">
        <div className="flex items-center gap-6">
          <Progress type="circle" percent={completion} size={80} strokeColor={{ '0%': '#3b82f6', '100%': '#22c55e' }} />
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile {completion}% Completed</h3>
            <p className="text-gray-500 dark:text-fintech-textMuted text-sm">Complete your profile to unlock all features.</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Account Statistics">
        <Row gutter={[24, 24]}>
          <Col xs={12} sm={6}>
            <Statistic title="Total Income" value={summary?.totalIncome || 0} prefix="₹" precision={2} valueStyle={{ color: '#22c55e' }} />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic title="Total Expenses" value={summary?.totalExpenses || 0} prefix="₹" precision={2} valueStyle={{ color: '#ef4444' }} />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic title="Current Balance" value={summary?.currentBalance !== undefined ? summary.currentBalance : (user?.openingBalance || 0)} prefix="₹" precision={2} />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic title="Total Transactions" value={summary?.totalTransactions || 0} />
          </Col>
        </Row>
      </SectionCard>

      <SectionCard title="Account Activity">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-500 dark:text-fintech-textMuted text-sm">Member Since</p>
            <p className="font-medium text-gray-900 dark:text-white">{new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-fintech-textMuted text-sm">Last Login</p>
            <p className="font-medium text-gray-900 dark:text-white">{user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'First time login'}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-fintech-textMuted text-sm">Email Status</p>
            {user?.isVerified ? (
              <Badge status="success" text={<span>Verified Email <SafetyCertificateFilled className="text-fintech-success ml-1" /></span>} className="text-gray-900 dark:text-white" />
            ) : (
              <Badge status="warning" text="Unverified" className="text-gray-900 dark:text-white" />
            )}
          </div>
        </div>
      </SectionCard>
    </div>
  );

  const editProfileContent = (
    <div className="space-y-6">
      <SectionCard title="Avatar Management">
        <div className="flex items-center gap-6">
          <Avatar size={100} src={avatarUrl} icon={<UserOutlined />} className="bg-fintech-primary" />
          <div className="space-y-2">
            <Upload 
              customRequest={handleAvatarUpload}
              showUploadList={false}
              accept=".jpg,.jpeg,.png,.webp"
            >
              <Button icon={<UploadOutlined />} loading={loading}>Upload Avatar</Button>
            </Upload>
            {user?.avatar && (
              <div className="mt-2">
                <Popconfirm
                  title="Delete Avatar"
                  description="Are you sure you want to delete your avatar?"
                  onConfirm={handleAvatarDelete}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger icon={<DeleteOutlined />} loading={loading}>Delete Avatar</Button>
                </Popconfirm>
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Profile Information">
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={handleProfileUpdate}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="firstName"
              label={<span className="dark:text-white">First Name</span>}
              rules={[{ required: true, message: 'First name is required' }]}
            >
              <Input placeholder="Enter first name" />
            </Form.Item>
            <Form.Item
              name="lastName"
              label={<span className="dark:text-white">Last Name</span>}
              rules={[{ required: true, message: 'Last name is required' }]}
            >
              <Input placeholder="Enter last name" />
            </Form.Item>
          </div>

          <Form.Item label={<span className="dark:text-white">Email Address (Read Only)</span>}>
            <Input value={user?.email} disabled />
          </Form.Item>

          <Form.Item
            name="openingBalance"
            label={<span className="dark:text-white">Opening Balance</span>}
            rules={[
              { required: true, message: 'Opening balance is required' },
              () => ({
                validator(_, value) {
                  if (!value || Number(value) >= 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Cannot be negative'));
                },
              }),
            ]}
            extra={<span className="text-fintech-textMuted text-xs">Changing opening balance affects overall balance calculations.</span>}
          >
            <Input type="number" step="0.01" prefix="₹" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} className="px-8 rounded-full">
            Update Profile
          </Button>
        </Form>
      </SectionCard>
    </div>
  );

  const securityContent = (
    <SectionCard title="Change Password">
      <Form
        form={passwordForm}
        layout="vertical"
        onFinish={handlePasswordChange}
        className="max-w-md"
      >
        <Form.Item
          name="currentPassword"
          label={<span className="dark:text-white">Current Password</span>}
          rules={[{ required: true, message: 'Current password is required' }]}
        >
          <Input.Password placeholder="Enter current password" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label={<span className="dark:text-white">New Password</span>}
          rules={[
            { required: true, message: 'New password is required' },
            { min: 8, message: 'Must be at least 8 characters' },
            { pattern: /(?=.*[a-z])/, message: 'Must contain a lowercase letter' },
            { pattern: /(?=.*[A-Z])/, message: 'Must contain an uppercase letter' },
            { pattern: /(?=.*\d)/, message: 'Must contain a number' },
          ]}
        >
          <Input.Password placeholder="Enter new password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={<span className="dark:text-white">Confirm New Password</span>}
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm new password" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} className="px-8 rounded-full">
          Change Password
        </Button>
      </Form>
    </SectionCard>
  );

  const tabItems = [
    { key: '1', label: 'Overview', children: overviewContent },
    { key: '2', label: 'Edit Profile', children: editProfileContent },
    { key: '3', label: 'Security Settings', children: securityContent },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Profile Settings" subtitle="Manage your account details and preferences." />

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <SectionCard className="text-center">
            <div className="flex flex-col items-center p-4">
              <Badge 
                count={user?.isVerified ? <SafetyCertificateFilled className="text-fintech-success text-xl" /> : null}
                offset={[-10, 10]}
              >
                <Avatar 
                  size={120} 
                  src={avatarUrl} 
                  icon={!avatarUrl && <UserOutlined />} 
                  className="bg-fintech-primary mb-4 border-4 border-white dark:border-fintech-bg shadow-sm"
                />
              </Badge>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4">{user?.firstName} {user?.lastName}</h2>
              <p className="text-gray-500 dark:text-fintech-textMuted mb-6">{user?.email}</p>
              
              <Upload 
                name="avatar" 
                showUploadList={false} 
                customRequest={handleAvatarUpload}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />} className="w-full mb-2">Change Avatar</Button>
              </Upload>
              
              {user?.avatar && (
                <Popconfirm title="Delete avatar?" onConfirm={handleAvatarDelete}>
                  <Button danger type="text" icon={<DeleteOutlined />} className="w-full">Remove Avatar</Button>
                </Popconfirm>
              )}
            </div>
          </SectionCard>
        </Col>
        
        <Col xs={24} md={16}>
          <SectionCard className="p-2">
            <Tabs defaultActiveKey="1" items={tabItems} className="fintech-tabs" />
          </SectionCard>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
