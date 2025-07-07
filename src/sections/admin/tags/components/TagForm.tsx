import { Form, Input, Modal } from 'antd';
import { Tag } from '@/store/tags/crud';
import { useEffect } from 'react';

interface TagFormProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (title: string) => Promise<void>;
    initialValues?: Tag | null;
    title: string;
    loading?: boolean;
}

export default function TagForm({ visible, onCancel, onSubmit, initialValues, title, loading = false }: TagFormProps) {
    const [form] = Form.useForm();

    useEffect(() => {
        return () => {
            form.resetFields();
        };
    }, []);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await onSubmit(values.name);
            form.resetFields();
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
                    rules={[{ required: true, message: 'Please input tag name!' }]}
                >
                    <Input />
                </Form.Item>
                {/* <Form.Item
                    name="description"
                    label="Description"
                >
                    <Input.TextArea rows={4} />
                </Form.Item> */}
            </Form>
        </Modal>
    );
} 