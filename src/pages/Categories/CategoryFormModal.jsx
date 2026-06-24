import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, ColorPicker, message, Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { createNewCategory, updateExistingCategory } from '../../store/categorySlice';
import { TRANSACTION_TYPES } from '../../constants/transactions';

const { Option } = Select;

// A predefined list of icons users can choose from
const ICON_LIST = [
  'AppstoreOutlined', 'BankOutlined', 'CoffeeOutlined', 'CarOutlined', 
  'ShoppingOutlined', 'MedicineBoxOutlined', 'PlaySquareOutlined', 
  'BookOutlined', 'LaptopOutlined', 'HomeOutlined', 'ToolOutlined', 
  'GiftOutlined', 'HeartOutlined', 'GlobalOutlined', 'WifiOutlined',
  'SkinOutlined', 'CameraOutlined', 'VideoCameraOutlined', 'BulbOutlined'
];

const CategoryFormModal = ({ visible, category, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.categories);
  const [selectedIcon, setSelectedIcon] = useState('AppstoreOutlined');

  // Watch type and icon for preview
  const formIcon = Form.useWatch('icon', form);
  
  useEffect(() => {
    setSelectedIcon(formIcon || 'AppstoreOutlined');
  }, [formIcon]);

  useEffect(() => {
    if (visible) {
      if (category) {
        form.setFieldsValue({
          ...category,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          type: TRANSACTION_TYPES.EXPENSE,
          icon: 'AppstoreOutlined',
          color: '#1677ff'
        });
      }
    }
  }, [visible, category, form]);

  const handleSubmit = async (values) => {
    try {
      // Extract hex from color picker if it's an object, else it's a string
      const colorValue = typeof values.color === 'string' ? values.color : values.color?.toHexString();
      
      const payload = {
        ...values,
        color: colorValue,
      };

      if (category) {
        await dispatch(updateExistingCategory({ id: category._id, data: payload })).unwrap();
        message.success('Category updated successfully');
      } else {
        await dispatch(createNewCategory(payload)).unwrap();
        message.success('Category created successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      message.error(error || 'Failed to save category');
    }
  };

  const IconComponent = Icons[selectedIcon] || Icons.AppstoreOutlined;

  const isDefaultCategory = category?.isDefault;

  return (
    <Modal
      title={category ? 'Edit Category' : 'Add Custom Category'}
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnClose
    >
      {isDefaultCategory && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md text-sm border border-blue-200">
          This is a default category. You can only customize its icon and color.
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="type"
          label="Category Type"
          rules={[{ required: true, message: 'Please select a type' }]}
        >
          <Select disabled={isDefaultCategory || !!category}>
            <Option value={TRANSACTION_TYPES.INCOME}>Income</Option>
            <Option value={TRANSACTION_TYPES.EXPENSE}>Expense</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="name"
          label="Category Name"
          rules={[
            { required: true, message: 'Please enter a name' },
            { min: 2, message: 'Name must be at least 2 characters' }
          ]}
        >
          <Input placeholder="E.g., Groceries, Salary" disabled={isDefaultCategory} />
        </Form.Item>

        <div className="flex gap-4">
          <Form.Item
            name="icon"
            label="Icon"
            className="w-2/3"
            rules={[{ required: true, message: 'Please select an icon' }]}
          >
            <Select showSearch placeholder="Select icon">
              {ICON_LIST.map(iconName => {
                const CurrentIcon = Icons[iconName];
                return (
                  <Option key={iconName} value={iconName}>
                    <Space>
                      {CurrentIcon && <CurrentIcon />}
                      {iconName.replace('Outlined', '')}
                    </Space>
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            label="Preview"
            className="w-1/3 text-center"
          >
            <div className="h-[32px] flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
              <IconComponent className="text-xl" />
            </div>
          </Form.Item>
        </div>

        <Form.Item
          name="color"
          label="Category Color"
          rules={[{ required: true, message: 'Please pick a color' }]}
        >
          <ColorPicker format="hex" showText className="w-full justify-start" />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default CategoryFormModal;
