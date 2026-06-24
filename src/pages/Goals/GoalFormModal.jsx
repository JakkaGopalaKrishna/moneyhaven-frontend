import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createNewGoal, updateExistingGoal } from '../../store/goalSlice';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const CATEGORIES = ['Emergency', 'Travel', 'Education', 'Vehicle', 'Home', 'Investment', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const GoalFormModal = ({ visible, goal, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.goals);

  useEffect(() => {
    if (visible) {
      if (goal) {
        form.setFieldsValue({
          title: goal.title,
          targetAmount: goal.targetAmount,
          targetDate: dayjs(goal.targetDate),
          category: goal.category,
          priority: goal.priority,
          notes: goal.notes,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          category: 'Other',
          priority: 'Medium',
        });
      }
    }
  }, [visible, goal, form]);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        targetDate: values.targetDate.format('YYYY-MM-DD'),
      };

      if (goal) {
        await dispatch(updateExistingGoal({ id: goal._id, data: payload })).unwrap();
        message.success('Goal updated successfully');
      } else {
        await dispatch(createNewGoal(payload)).unwrap();
        message.success('Goal created successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      message.error(error || 'Failed to save goal');
    }
  };

  const disabledDate = (current) => {
    // Can not select days before today or today
    return current && current < dayjs().endOf('day');
  };

  return (
    <Modal
      title={goal ? 'Edit Savings Goal' : 'Create New Savings Goal'}
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
        <Form.Item
          name="title"
          label="Goal Title"
          rules={[{ required: true, message: 'Please enter a goal title' }]}
        >
          <Input placeholder="e.g. Emergency Fund" />
        </Form.Item>

        <Form.Item
          name="targetAmount"
          label="Target Amount"
          rules={[
            { required: true, message: 'Please enter target amount' },
            { type: 'number', min: 1, message: 'Must be greater than zero' }
          ]}
          help={goal ? `Cannot be lower than already saved amount (₹${goal.savedAmount || 0})` : ''}
        >
          <InputNumber
            className="w-full"
            formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/₹\s?|(,*)/g, '')}
            min={1}
          />
        </Form.Item>

        <Form.Item
          name="targetDate"
          label="Target Date"
          rules={[{ required: true, message: 'Please select a target date' }]}
        >
          <DatePicker className="w-full" disabledDate={disabledDate} />
        </Form.Item>

        <div className="flex gap-4">
          <Form.Item
            name="category"
            label="Category"
            className="w-1/2"
            rules={[{ required: true }]}
          >
            <Select>
              {CATEGORIES.map(c => <Option key={c} value={c}>{c}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priority"
            className="w-1/2"
            rules={[{ required: true }]}
          >
            <Select>
              {PRIORITIES.map(p => <Option key={p} value={p}>{p}</Option>)}
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="notes"
          label="Notes"
          rules={[{ max: 500, message: 'Notes cannot exceed 500 characters' }]}
        >
          <TextArea rows={3} placeholder="Why is this goal important?" />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default GoalFormModal;
