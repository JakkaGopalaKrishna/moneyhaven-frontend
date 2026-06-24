import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchSchedules, createSchedule, updateSchedule, deleteSchedule, fetchScheduleHealth 
} from '../../store/reportScheduleSlice';
import { 
  Card, Typography, Button, Table, Tag, Modal, Form, Select, Input,
  Space, Popconfirm, message, Switch, Statistic, Row, Col
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, 
  CloseCircleOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const ScheduledReports = () => {
  const dispatch = useDispatch();
  const { schedules, health, loading } = useSelector(state => state.schedules);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchSchedules());
    dispatch(fetchScheduleHealth());
  }, [dispatch]);

  const handleOpenModal = (record = null) => {
    setEditingSchedule(record);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingSchedule) {
        await dispatch(updateSchedule({ id: editingSchedule._id, data: values })).unwrap();
        message.success('Schedule updated successfully');
      } else {
        await dispatch(createSchedule(values)).unwrap();
        message.success('Schedule created successfully');
      }
      setIsModalVisible(false);
    } catch (err) {
      message.error(err || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteSchedule(id)).unwrap();
      message.success('Schedule deleted');
    } catch (err) {
      message.error(err || 'Failed to delete schedule');
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await dispatch(updateSchedule({ id, data: { isActive } })).unwrap();
      message.success(`Schedule ${isActive ? 'resumed' : 'paused'}`);
    } catch (err) {
      message.error('Failed to update status');
    }
  };

  const columns = [
    {
      title: 'Report Type',
      dataIndex: 'reportType',
      key: 'reportType',
      render: text => <span className="font-medium text-blue-600 dark:text-blue-400">{text}</span>
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
    },
    {
      title: 'Format',
      dataIndex: 'format',
      key: 'format',
      render: text => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Next Run',
      dataIndex: 'nextRunAt',
      key: 'nextRunAt',
      render: date => <Text type="secondary">{dayjs(date).format('MMM D, YYYY')}</Text>
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Switch 
          checkedChildren="Active" 
          unCheckedChildren="Paused" 
          checked={record.isActive}
          onChange={(checked) => handleToggleActive(record._id, checked)}
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
          <Popconfirm title="Delete this schedule?" onConfirm={() => handleDelete(record._id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="!mb-1 dark:text-white">Scheduled Reports</Title>
          <Text className="text-gray-500 dark:text-gray-400">Automate your financial report generation.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
          Create Schedule
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="shadow-sm border-t-4 border-t-blue-500">
            <Statistic 
              title="Active Schedules" 
              value={schedules.filter(s => s.isActive).length} 
              prefix={<ClockCircleOutlined className="text-blue-500" />} 
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="shadow-sm border-t-4 border-t-green-500">
            <Statistic 
              title="Successful Executions" 
              value={health?.successfulJobs || 0} 
              prefix={<CheckCircleOutlined className="text-green-500" />} 
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="shadow-sm border-t-4 border-t-red-500">
            <Statistic 
              title="Failed Executions" 
              value={health?.failedJobs || 0} 
              prefix={<CloseCircleOutlined className="text-red-500" />} 
            />
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Table 
          columns={columns} 
          dataSource={schedules} 
          rowKey="_id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>

      <Modal
        title={editingSchedule ? "Edit Schedule" : "Create Schedule"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="reportType" label="Report Type" rules={[{ required: true }]}>
            <Select>
              <Option value="Monthly">Monthly Report</Option>
              <Option value="Yearly">Yearly Report</Option>
              <Option value="Executive Summary">Executive Summary</Option>
              <Option value="Financial Health">Financial Health Report</Option>
              <Option value="Goals">Savings Goals Report</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="frequency" label="Frequency" rules={[{ required: true }]}>
            <Select>
              <Option value="Weekly">Weekly</Option>
              <Option value="Monthly">Monthly</Option>
              <Option value="Quarterly">Quarterly</Option>
              <Option value="Yearly">Yearly</Option>
            </Select>
          </Form.Item>

          <Form.Item name="format" label="Export Format" rules={[{ required: true }]}>
            <Select>
              <Option value="PDF">PDF Document</Option>
              <Option value="CSV">CSV Data</Option>
              <Option value="Excel">Excel Spreadsheet</Option>
            </Select>
          </Form.Item>

          <Form.Item name="email" label="Delivery Email (Optional)">
            <Input placeholder="Leave blank to use in-app notifications" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ScheduledReports;
