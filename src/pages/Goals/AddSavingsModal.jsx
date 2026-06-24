import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, message, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addSavingsToGoal } from '../../store/goalSlice';
import dayjs from 'dayjs';
import { formatCurrency } from '../../utils/currencyFormatter';

const { Text } = Typography;
const { TextArea } = Input;

const AddSavingsModal = ({ visible, goal, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.goals);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue({
        contributionDate: dayjs(),
      });
    }
  }, [visible, form]);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        amount: values.amount,
        note: values.note,
        contributionDate: values.contributionDate.toISOString(),
      };

      const res = await dispatch(addSavingsToGoal({ id: goal._id, data: payload })).unwrap();
      
      if (res.message && res.message.includes('Completed')) {
        message.success({ content: '🎉 Goal Completed! Congratulations!', duration: 5 });
      } else {
        message.success('Savings added successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      message.error(error || 'Failed to add savings');
    }
  };

  const remaining = goal ? goal.targetAmount - goal.savedAmount : 0;

  return (
    <Modal
      title={`Add Savings to: ${goal?.title}`}
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnClose
    >
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4 flex justify-between items-center">
        <Text>Remaining to Target:</Text>
        <Text strong className="text-blue-600 dark:text-blue-400 text-lg">
          {formatCurrency(remaining)}
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="amount"
          label="Contribution Amount"
          rules={[
            { required: true, message: 'Please enter amount' },
            { type: 'number', min: 0.01, message: 'Must be greater than zero' },
            { type: 'number', max: remaining, message: `Cannot exceed remaining amount of ${formatCurrency(remaining)}` }
          ]}
        >
          <InputNumber
            className="w-full"
            formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/₹\s?|(,*)/g, '')}
            min={0.01}
            max={remaining}
            autoFocus
          />
        </Form.Item>

        <Form.Item
          name="contributionDate"
          label="Date"
          rules={[{ required: true, message: 'Please select a date' }]}
        >
          <DatePicker className="w-full" disabledDate={current => current > dayjs().endOf('day')} />
        </Form.Item>

        <Form.Item
          name="note"
          label="Note (Optional)"
          rules={[{ max: 250, message: 'Note cannot exceed 250 characters' }]}
        >
          <TextArea rows={2} placeholder="e.g. From May Salary Bonus" />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default AddSavingsModal;
