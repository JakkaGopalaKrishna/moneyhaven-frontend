import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Table, Button, Input, Space, Tag, Modal, message, Select, DatePicker, Row, Col, Typography, InputNumber, List
} from 'antd';
import { 
  PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, FilterOutlined 
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTransactions, removeTransaction, clearTransactionError 
} from '../../store/transactionSlice';
import { fetchCategories } from '../../store/categorySlice';
import { getDashboardSummaryUser } from '../../store/dashboardSlice';
import TransactionFormModal from './TransactionFormModal';
import TransactionDetailsDrawer from './TransactionDetailsDrawer';
import { CATEGORY_COLORS, TRANSACTION_TYPES } from '../../constants/transactions';
import { formatCurrency } from '../../utils/currencyFormatter';
import dayjs from 'dayjs';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import EmptyState from '../../components/common/EmptyState';

const { Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Transactions = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { transactions, loading, pagination, error } = useSelector((state) => state.transactions);
  const { categories } = useSelector((state) => state.categories);

  // Local state for modals and drawer
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [viewingTransaction, setViewingTransaction] = useState(null);

  // Local state for filters and pagination
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    type: undefined,
    category: undefined,
    startDate: undefined,
    endDate: undefined,
    minAmount: undefined,
    maxAmount: undefined,
    sort: 'newest',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    loadTransactions();
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [currentPage, pageSize, filters]);

  useEffect(() => {
    if (location.state?.openModal) {
      setIsFormVisible(true);
      // Clean up state so refresh doesn't reopen modal
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearTransactionError());
    }
  }, [error, dispatch]);

  const loadTransactions = () => {
    const params = {
      page: currentPage,
      limit: pageSize,
      search: searchText,
      ...filters,
    };
    dispatch(fetchTransactions(params));
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
    loadTransactions();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleDateRangeChange = (dates) => {
    if (dates) {
      handleFilterChange('startDate', dates[0].toISOString());
      handleFilterChange('endDate', dates[1].toISOString());
    } else {
      setFilters(prev => ({ ...prev, startDate: undefined, endDate: undefined }));
    }
  };

  const handleAdd = () => {
    setEditingTransaction(null);
    setIsFormVisible(true);
  };

  const handleEdit = (record) => {
    setEditingTransaction(record);
    setIsFormVisible(true);
  };

  const handleView = (record) => {
    setViewingTransaction(record);
    setIsDrawerVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this transaction?',
      content: 'This will soft-delete the transaction and affect your current balance.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await dispatch(removeTransaction(id)).unwrap();
          message.success('Transaction deleted successfully');
          dispatch(getDashboardSummaryUser()); // Sync dashboard
          loadTransactions();
        } catch (err) {
          message.error(err || 'Failed to delete transaction');
        }
      },
    });
  };

  const onFormSuccess = () => {
    dispatch(getDashboardSummaryUser()); // Sync dashboard
    loadTransactions();
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => (
        <Text type={record.type === TRANSACTION_TYPES.INCOME ? 'success' : 'danger'} strong>
          {record.type === TRANSACTION_TYPES.INCOME ? '+' : '-'} {formatCurrency(amount)}
        </Text>
      ),
      sorter: true,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === TRANSACTION_TYPES.INCOME ? 'green' : 'red'}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (categoryObj, record) => {
        if (!categoryObj) {
          return <Tag>{record.categoryNameSnapshot}</Tag>;
        }
        return (
          <Tag color={categoryObj.color || 'default'}>
            {categoryObj.name}
          </Tag>
        );
      },
    },
    {
      title: 'Date',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      render: (date) => dayjs(date).format('MMM D, YYYY'),
      sorter: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} />
        </Space>
      ),
    },
  ];

  const handleTableChange = (paginationInfo, filters, sorter) => {
    setCurrentPage(paginationInfo.current);
    setPageSize(paginationInfo.pageSize);

    if (sorter.field) {
      if (sorter.field === 'amount') {
        handleFilterChange('sort', sorter.order === 'ascend' ? 'lowest' : 'highest');
      } else if (sorter.field === 'transactionDate') {
        handleFilterChange('sort', sorter.order === 'ascend' ? 'oldest' : 'newest');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Transactions" 
        subtitle="Manage your income and expenses efficiently."
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large" className="rounded-full px-6">
            Add Transaction
          </Button>
        }
      />

      <SectionCard>
        {/* Filters Section */}
        <div className="space-y-4 mb-6">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Input.Search
                placeholder="Search by title..."
                allowClear
                onSearch={handleSearch}
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                className="w-full"
                placeholder="Filter by Type"
                allowClear
                onChange={(val) => handleFilterChange('type', val)}
              >
                <Option value={TRANSACTION_TYPES.INCOME}>Income</Option>
                <Option value={TRANSACTION_TYPES.EXPENSE}>Expense</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <RangePicker 
                className="w-full" 
                onChange={handleDateRangeChange}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
               <Select
                className="w-full"
                placeholder="Sort By"
                value={filters.sort}
                onChange={(val) => handleFilterChange('sort', val)}
              >
                <Option value="newest">Newest First</Option>
                <Option value="oldest">Oldest First</Option>
                <Option value="highest">Highest Amount</Option>
                <Option value="lowest">Lowest Amount</Option>
              </Select>
            </Col>
          </Row>
        </div>

        {/* Desktop Table Section */}
        <div className="hidden md:block overflow-hidden">
          <Table
            columns={columns}
            dataSource={transactions}
            rowKey="_id"
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: pagination.total,
              showSizeChanger: true,
            }}
            onChange={handleTableChange}
            scroll={{ x: 800 }}
            locale={{
              emptyText: (
                <div className="py-8">
                  <p className="text-fintech-textMuted mb-4">No transactions found.</p>
                  <Button type="primary" onClick={handleAdd}>Add your first transaction</Button>
                </div>
              )
            }}
          />
        </div>

        {/* Mobile Cards Section */}
        <div className="block md:hidden">
          <List
            dataSource={transactions}
            loading={loading}
            rowKey="_id"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: pagination.total,
              onChange: (page, size) => handleTableChange({ current: page, pageSize: size }, {}, {}),
              size: "small",
              className: "text-center mt-4",
              hideOnSinglePage: true,
            }}
            locale={{ emptyText: <EmptyState title="No Transactions" description="Start tracking your spending." /> }}
            renderItem={item => (
              <div className="bg-white dark:bg-fintech-bg/30 border border-gray-100 dark:border-fintech-border/50 p-4 rounded-xl mb-3 shadow-sm relative">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-fintech-surface/80 flex items-center justify-center text-lg">
                      {item.type === 'income' ? '💰' : '🛒'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-fintech-text text-sm m-0">{item.title}</h4>
                      <div className="text-xs text-gray-500 dark:text-fintech-textMuted mt-0.5">{dayjs(item.transactionDate).format('MMM D, YYYY')}</div>
                    </div>
                  </div>
                  <div className={`font-bold text-right text-sm ${item.type === 'income' ? 'text-fintech-success' : 'text-fintech-danger'}`}>
                    {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-fintech-border/50">
                  <Tag color={item.categoryId?.color || 'default'} className="m-0 border-0 rounded-md text-[10px]">
                    {item.categoryId?.name || item.categoryNameSnapshot}
                  </Tag>
                  <div className="flex gap-2">
                    <Button type="text" size="small" className="text-gray-400 dark:text-fintech-textMuted" icon={<EyeOutlined />} onClick={() => handleView(item)} />
                    <Button type="text" size="small" className="text-gray-400 dark:text-fintech-textMuted" icon={<EditOutlined />} onClick={() => handleEdit(item)} />
                    <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(item._id)} />
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </SectionCard>

      <TransactionFormModal
        visible={isFormVisible}
        transaction={editingTransaction}
        onClose={() => setIsFormVisible(false)}
        onSuccess={onFormSuccess}
      />

      <TransactionDetailsDrawer
        visible={isDrawerVisible}
        transaction={viewingTransaction}
        onClose={() => setIsDrawerVisible(false)}
      />
    </div>
  );
};

export default Transactions;
