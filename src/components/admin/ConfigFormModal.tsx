import { ConfigItem } from '@/api/configService'
import { Button, Form, Input, Modal, Space } from 'antd'
import React from 'react'

const { TextArea } = Input

interface ConfigFormModalProps {
  visible: boolean
  editingConfig: ConfigItem | null
  onCancel: () => void
  onSubmit: (values: ConfigItem) => Promise<void>
  loading?: boolean
}

const ConfigFormModal: React.FC<ConfigFormModalProps> = ({
  visible,
  editingConfig,
  onCancel,
  onSubmit,
  loading = false
}) => {
  const [form] = Form.useForm()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      await onSubmit(values)
    } catch (error) {
      console.error('Form validation failed:', error)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <Modal
      title={editingConfig ? 'Edit Config' : 'Add New Config'}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={editingConfig || { key: '', value: '', description: '' }}
      >
        <Form.Item
          name="key"
          label="Key"
          rules={[
            { required: true, message: 'Please enter the config key' },
            { max: 100, message: 'Key cannot exceed 100 characters' },
            {
              pattern: /^[a-zA-Z0-9_-]+$/,
              message:
                'Key can only contain letters, numbers, hyphens, and underscores'
            }
          ]}
        >
          <Input placeholder="Enter config key" disabled={!!editingConfig} />
        </Form.Item>

        <Form.Item
          name="value"
          label="Value"
          rules={[
            { required: true, message: 'Please enter the config value' },
            { max: 500, message: 'Value cannot exceed 500 characters' }
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Enter config value"
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: 'Please enter the config description' },
            { max: 200, message: 'Description cannot exceed 200 characters' }
          ]}
        >
          <TextArea
            rows={3}
            placeholder="Enter config description"
            maxLength={200}
            showCount
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              {editingConfig ? 'Update' : 'Create'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ConfigFormModal
