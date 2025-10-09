import { Form, Input, Modal, Select, Switch } from 'antd';
import { User } from '@/store/user/crud';
import { useEffect } from 'react';

interface UserFormProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (data: Partial<User>) => Promise<void>;
    initialValues?: User | null;
    title: string;
    loading?: boolean;
}

const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' }
];

export default function UserForm({
    visible,
    onCancel,
    onSubmit,
    initialValues,
    title,
    loading = false,
}: UserFormProps) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && initialValues) {
            form.resetFields();
            form.setFieldsValue({
                ...initialValues,
                isActive: initialValues.isActive == 'true'
            });
        }
    }, [visible, initialValues, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            // Convert boolean isActive to string and include id for update
            const submitData = {
                ...values,
                id: initialValues?.id,
                isActive: values.isActive ? 'true' : 'false'
            };
            await onSubmit(submitData);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <Modal
            title={title}
            open={visible}
            onOk={handleSubmit}
            onCancel={onCancel}
            destroyOnClose
            confirmLoading={loading}
            okText="Save"
            cancelText="Cancel"
            maskClosable={false}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={initialValues || {}}
            >
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                        { required: true, message: 'Please enter username!' },
                        { min: 3, message: 'Username must be at least 3 characters!' }
                    ]}
                >
                    <Input placeholder="Enter username" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Please enter email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                >
                    <Input placeholder="Enter email address" />
                </Form.Item>

                <Form.Item
                    name="role"
                    label="Role"
                    rules={[{ required: true, message: 'Please select a role!' }]}
                >
                    <Select placeholder="Select user role" options={roleOptions} />
                </Form.Item>

                <Form.Item
                    name="phoneNumber"
                    label="Phone Number"
                    rules={[
                        { pattern: /^[0-9+\-\s()]+$/, message: 'Please enter a valid phone number!' }
                    ]}
                >
                    <Input placeholder="Enter phone number (optional)" />
                </Form.Item>

                <Form.Item
                    name="isActive"
                    label="Active Status"
                    valuePropName="checked"
                >
                    <Switch
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                        defaultChecked={true}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
