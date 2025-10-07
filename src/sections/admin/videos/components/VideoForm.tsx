import { Form, Input, Modal, Button, Select } from 'antd';
import { Video } from '@/store/video/crud';
import { useEffect } from 'react';

interface VideoFormProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (data: Omit<Video, 'id' | 'createdAt'>) => Promise<void>;
    initialValues?: Video | null;
    title: string;
    loading?: boolean;
}

export default function VideoForm({
    visible,
    onCancel,
    onSubmit,
    initialValues,
    title,
    loading = false,
}: VideoFormProps) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            form.resetFields();
            if (initialValues) {
                form.setFieldsValue({ ...initialValues });
            }
        }
    }, [visible, initialValues, form]);

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
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: 'Please enter video title!' }]}
                >
                    <Input placeholder="Enter video title" />
                </Form.Item>

                <Form.Item
                    name="contentListVideo"
                    label="Video Link"
                    rules={[
                        { required: true, message: 'Please enter video link!' },
                        { type: 'url', message: 'Please enter a valid URL!' }
                    ]}
                >
                    <Input placeholder="https://www.youtube.com/watch?v=..." />
                </Form.Item>

                <Form.Item
                    name="videoPositionPage"
                    label="Position"
                >
                    <Select
                        placeholder="Select position"
                        options={[{ value: 0, label: 'HomePage' }]}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
