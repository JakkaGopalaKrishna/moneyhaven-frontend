import React, { useEffect, useState } from 'react';
import { 
  Table, Button, Input, Space, Tag, Modal, message, Select, Row, Col, Typography, Card, Statistic 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined, TagsOutlined, AppstoreOutlined
} from '@ant-design/icons';
import * as Icons from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCategories, fetchCategoryStats, removeCategory, clearCategoryError 
} from '../../store/categorySlice';
import CategoryFormModal from './CategoryFormModal';
import { TRANSACTION_TYPES } from '../../constants/transactions';
import { formatCurrency } from '../../utils/currencyFormatter';

const { Title, Text } = Typography;
const { Option } = Select;

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, stats, loading, error } = useSelector((state) => state.categories);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState(undefined);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearCategoryError());
    }
  }, [error, dispatch]);

  const loadData = () => {
    dispatch(fetchCategories());
    dispatch(fetchCategoryStats());
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setIsFormVisible(true);
  };

  const handleEdit = (record) => {
    setEditingCategory(record);
    setIsFormVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this category?',
      content: 'If this category is linked to transactions, deletion will be prevented.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await dispatch(removeCategory(id)).unwrap();
          message.success('Category deleted successfully');
          loadData();
        } catch (err) {
          message.error(err || 'Failed to delete category');
        }
      },
    });
  };

  // Client-side filtering
  const filteredCategories = categories.filter((c) => {
    const matchType = filterType ? c.type === filterType : true;
    const matchSearch = c.name.toLowerCase().includes(searchText.toLowerCase());
    return matchType && matchSearch;
  });

  const columns = [
    {
      title: 'Category',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name, record) => {
        const IconCmp = Icons[record.icon] || Icons.AppstoreOutlined;
        return (
          <Space>
            <div 
              className="flex items-center justify-center w-8 h-8 rounded-md text-white shadow-sm"
              style={{ backgroundColor: record.color }}
            >
              <IconCmp />
            </div>
            <Text strong>{name}</Text>
            {record.isDefault && <LockOutlined className="text-gray-400 text-xs ml-1" title="Default Category" />}
          </Space>
        );
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Income', value: 'income' },
        { text: 'Expense', value: 'expense' },
      ],
      onFilter: (value, record) => record.type === value,
      render: (type) => (
        <Tag color={type === TRANSACTION_TYPES.INCOME ? 'green' : 'red'}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Usage',
      dataIndex: 'transactionCount',
      key: 'transactionCount',
      sorter: (a, b) => a.transactionCount - b.transactionCount,
      render: (count) => (
        <Space>
          <Badge status={count > 0 ? 'processing' : 'default'} />
          <Text>{count} transactions</Text>
        </Space>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (amount, record) => (
        <Text strong type={record.type === TRANSACTION_TYPES.INCOME ? 'success' : 'danger'}>
          {formatCurrency(amount || 0)}
        </Text>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record._id)}
            disabled={record.isDefault}
            title={record.isDefault ? 'Cannot delete default categories' : 'Delete'}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Title level={2} className="!mb-1 dark:text-white">Categories</Title>
          <Text className="text-gray-500 dark:text-gray-400">Manage your income and expense categories.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
          Add Category
        </Button>
      </div>

      {/* Stats Dashboard */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Total Categories" value={stats?.totalCategories || 0} prefix={<AppstoreOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Active Categories" value={stats?.activeCategories || 0} prefix={<TagsOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Income Categories" value={stats?.incomeCategories || 0} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Expense Categories" value={stats?.expenseCategories || 0} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
      </Row>

      {/* Filters Section */}
      <div className="bg-white dark:bg-[#1f1f1f] p-4 rounded-lg shadow-sm space-y-4">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={12}>
            <Input.Search
              placeholder="Search categories..."
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
            />
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Select
              className="w-full"
              placeholder="Filter by Type"
              allowClear
              onChange={(val) => setFilterType(val)}
            >
              <Option value={TRANSACTION_TYPES.INCOME}>Income</Option>
              <Option value={TRANSACTION_TYPES.EXPENSE}>Expense</Option>
            </Select>
          </Col>
        </Row>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredCategories}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
          locale={{
            emptyText: (
              <div className="py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No categories found.</p>
                <Button type="primary" onClick={handleAdd}>Create your first category</Button>
              </div>
            )
          }}
        />
      </div>

      <CategoryFormModal
        visible={isFormVisible}
        category={editingCategory}
        onClose={() => setIsFormVisible(false)}
        onSuccess={() => loadData()}
      />
    </div>
  );
};

export default Categories;
