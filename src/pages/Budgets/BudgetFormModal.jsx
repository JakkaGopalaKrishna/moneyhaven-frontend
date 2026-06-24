import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, InputNumber, Slider, Input, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createNewBudget, updateExistingBudget } from '../../store/budgetSlice';
import { fetchCategories } from '../../store/categorySlice';
import { TRANSACTION_TYPES } from '../../constants/transactions';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const BudgetFormModal = ({ visible, budget, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.budgets);
  const { categories } = useSelector((state) => state.categories);
  const [expenseCategories, setExpenseCategories] = useState([]);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    // Filter only expense categories
    const expenses = categories.filter(c => c.type === TRANSACTION_TYPES.EXPENSE && c.isActive);
    setExpenseCategories(expenses);
  }, [categories]);

  useEffect(() => {
    if (visible) {
      if (budget) {
        form.setFieldsValue({
          categoryId: typeof budget.category === 'object' ? budget.category._id : budget.category,
          amount: budget.budgetAmount || budget.amount,
          month: budget.month || dayjs().month() + 1,
          year: budget.year || dayjs().year(),
          alertThreshold: budget.alertThreshold || 80,
          notes: budget.notes || '',
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          month: dayjs().month() + 1,
          year: dayjs().year(),
          alertThreshold: 80,
        });
      }
    }
  }, [visible, budget, form]);

  const handleSubmit = async (values) => {
    try {
      if (budget) {
        // For update, we only allow updating amount, threshold, and notes.
        // We cannot change category, month, or year on an existing budget.
        await dispatch(updateExistingBudget({ 
          id: budget._id, 
          data: {
            amount: values.amount,
            alertThreshold: values.alertThreshold,
            notes: values.notes,
          } 
        })).unwrap();
        message.success('Budget updated successfully');
      } else {
        await dispatch(createNewBudget(values)).unwrap();
        message.success('Budget created successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      message.error(error || 'Failed to save budget');
    }
  };

  const currentYear = dayjs().year();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' },
    { value: 3, label: 'March' }, { value: 4, label: 'April' },
    { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' },
    { value: 9, label: 'September' }, { value: 10, label: 'October' },
    { value: 11, label: 'November' }, { value: 12, label: 'December' },
  ];

  return (
    <Modal
      title={budget ? 'Edit Budget' : 'Create Monthly Budget'}
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
      >
        {!budget && (
          <div className="flex gap-4">
            <Form.Item
              name="month"
              label="Month"
              className="w-1/2"
              rules={[{ required: true, message: 'Please select a month' }]}
            >
              <Select>
                {months.map(m => (
                  <Option key={m.value} value={m.value}>{m.label}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="year"
              label="Year"
              className="w-1/2"
              rules={[{ required: true, message: 'Please select a year' }]}
            >
              <Select>
                {years.map(y => (
                  <Option key={y} value={y}>{y}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        )}

        <Form.Item
          name="categoryId"
          label="Expense Category"
          rules={[{ required: true, message: 'Please select an expense category' }]}
        >
          <Select placeholder="Select category" disabled={!!budget}>
            {expenseCategories.map(cat => (
              <Option key={cat._id} value={cat._id}>{cat.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="amount"
          label="Budget Amount"
          rules={[
            { required: true, message: 'Please enter a budget amount' },
            { type: 'number', min: 0.01, message: 'Must be greater than zero' }
          ]}
          help={budget ? `Cannot be lower than already spent amount (₹${budget.spentAmount || 0})` : ''}
        >
          <InputNumber
            className="w-full"
            formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/₹\s?|(,*)/g, '')}
            min={0.01}
          />
        </Form.Item>

        <Form.Item
          name="alertThreshold"
          label="Alert Threshold (%)"
          rules={[{ required: true, message: 'Please set an alert threshold' }]}
        >
          <Slider
            min={50}
            max={100}
            marks={{
              50: '50%',
              80: '80%',
              100: '100%',
            }}
          />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Notes"
          rules={[{ max: 500, message: 'Notes cannot exceed 500 characters' }]}
        >
          <TextArea rows={2} placeholder="E.g., Try to reduce eating out this month." />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default BudgetFormModal;
