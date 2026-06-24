import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber, message } from 'antd';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { createNewTransaction, updateExistingTransaction } from '../../store/transactionSlice';
import { TRANSACTION_TYPES, CATEGORIES, PAYMENT_METHODS } from '../../constants/transactions';

const { TextArea } = Input;
const { Option } = Select;

const TransactionFormModal = ({ visible, transaction, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.transactions);

  // Watch type to reset category if type changes
  const selectedType = Form.useWatch('type', form);

  useEffect(() => {
    if (visible) {
      if (transaction) {
        form.setFieldsValue({
          ...transaction,
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
      const payload = {
        ...values,
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
          <Select onChange={() => form.setFieldValue('category', undefined)}>
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
            name="category"
            label="Category"
            className="w-1/2"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select placeholder="Select category">
              {(CATEGORIES[selectedType] || []).map(cat => (
                <Option key={cat} value={cat}>{cat}</Option>
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
