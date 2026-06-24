import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber, message, Divider, Space, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { createNewTransaction, updateExistingTransaction } from '../../store/transactionSlice';
import { createNewCategory } from '../../store/categorySlice';
import { TRANSACTION_TYPES, PAYMENT_METHODS } from '../../constants/transactions';

const { TextArea } = Input;
const { Option } = Select;

const TransactionFormModal = ({ visible, transaction, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.transactions);
  const { categories } = useSelector((state) => state.categories);
  const [newCategoryName, setNewCategoryName] = useState('');
  const inputRef = useRef(null);

  // Watch type to reset category if type changes
  const selectedType = Form.useWatch('type', form);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    try {
      const res = await dispatch(createNewCategory({ 
        name: newCategoryName, 
        type: selectedType || TRANSACTION_TYPES.EXPENSE
      })).unwrap();
      
      message.success('Category added');
      setNewCategoryName('');
      setTimeout(() => {
        form.setFieldValue('categoryId', res.data._id);
      }, 0);
    } catch (err) {
      message.error(err || 'Failed to add category');
    }
  };

  useEffect(() => {
    if (visible) {
      if (transaction) {
        form.setFieldsValue({
          ...transaction,
          categoryId: typeof transaction.categoryId === 'object' ? transaction.categoryId._id : transaction.categoryId,
          transactionDate: dayjs(transaction.transactionDate),
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          type: TRANSACTION_TYPES.EXPENSE,
          transactionDate: dayjs(),
          paymentMethod: 'Cash'
        });
      }
    }
  }, [visible, transaction, form]);

  const handleSubmit = async (values) => {
    try {
      const selectedCategory = categories.find(c => c._id === values.categoryId);
      const payload = {
        ...values,
        categoryNameSnapshot: selectedCategory ? selectedCategory.name : '',
        transactionDate: values.transactionDate.toISOString(),
      };

      if (transaction) {
        await dispatch(updateExistingTransaction({ id: transaction._id, data: payload })).unwrap();
        message.success('Transaction updated successfully');
      } else {
        await dispatch(createNewTransaction(payload)).unwrap();
        message.success('Transaction created successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      message.error(error || 'Failed to save transaction');
    }
  };

  const disabledDate = (current) => {
    return current && current > dayjs().endOf('day');
  };

  return (
    <Modal
      title={transaction ? 'Edit Transaction' : 'Add Transaction'}
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ type: TRANSACTION_TYPES.EXPENSE }}
      >
        <Form.Item
          name="type"
          label="Transaction Type"
          rules={[{ required: true, message: 'Please select a type' }]}
        >
          <Select onChange={() => form.setFieldValue('categoryId', undefined)}>
            <Option value={TRANSACTION_TYPES.INCOME}>Income</Option>
            <Option value={TRANSACTION_TYPES.EXPENSE}>Expense</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount"
          rules={[
            { required: true, message: 'Please enter an amount' },
            { type: 'number', min: 0.01, message: 'Amount must be greater than zero' }
          ]}
        >
          <InputNumber
            className="w-full"
            formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/₹\s?|(,*)/g, '')}
            min={0.01}
          />
        </Form.Item>

        <Form.Item
          name="title"
          label="Title"
          rules={[
            { required: true, message: 'Please enter a title' },
            { min: 3, message: 'Title must be at least 3 characters' }
          ]}
        >
          <Input placeholder="E.g., Groceries, Salary, Rent" />
        </Form.Item>

        <div className="flex gap-4">
          <Form.Item
            name="categoryId"
            label="Category"
            className="w-1/2"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select 
              placeholder="Select category"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <Space style={{ padding: '0 8px 4px' }}>
                    <Input
                      placeholder="New category"
                      ref={inputRef}
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                      onPressEnter={handleAddCategory}
                    />
                    <Button type="text" icon={<PlusOutlined />} onClick={handleAddCategory}>
                      Add
                    </Button>
                  </Space>
                </>
              )}
            >
              {categories.filter(c => c.type === selectedType).map(cat => (
                <Option key={cat._id} value={cat._id}>{cat.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="paymentMethod"
            label="Payment Method"
            className="w-1/2"
            rules={[{ required: true, message: 'Please select payment method' }]}
          >
            <Select placeholder="Method">
              {PAYMENT_METHODS.map(method => (
                <Option key={method} value={method}>{method}</Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="transactionDate"
          label="Date"
          rules={[{ required: true, message: 'Please select a date' }]}
        >
          <DatePicker className="w-full" disabledDate={disabledDate} />
        </Form.Item>

        <Form.Item
          name="description"
          label="Notes (Optional)"
          rules={[{ max: 500, message: 'Notes cannot exceed 500 characters' }]}
        >
          <TextArea rows={3} placeholder="Add any extra details here..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TransactionFormModal;
