import { Form, Input, Modal } from 'antd';
import { Category } from '@/store/categories/crud';
import { useEffect } from 'react';

interface CategoryFormProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: Omit<Category, 'id' | 'createdAt'>) => Promise<void>;
    initialValues?: Category | null;
    title: string;
    loading?: boolean;
}

export default function CategoryForm({ visible, onCancel, onSubmit, initialValues, title, loading = false }: CategoryFormProps) {
    const [form] = Form.useForm();


    useEffect(() => {
        if (visible) {
            form.resetFields();
        }
    }, [visible]);
    // region methods
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await onSubmit(values);
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
            maskClosable={false}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={initialValues || {}}
            >
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Please input category name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
            </Form>
        </Modal>
    );
} 