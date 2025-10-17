import { Form, Input, Modal, InputNumber } from 'antd';
import { Article } from '@/store/article/crud';
import { useEffect } from 'react';

interface RateViewFormProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (data: {
        id: string;
        fakeViewAmount: number;
    }) => Promise<void>;
    article?: Article | null;
    loading?: boolean;
}

export default function RateViewForm({
    visible,
    onCancel,
    onSubmit,
    article,
    loading = false,
}: RateViewFormProps) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && article) {
            form.resetFields();
            form.setFieldsValue({
                fakeViewAmount: article.fakeViewAmount || 0,
            });
        }
    }, [visible, article, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await onSubmit({
                id: article!.id,
                fakeViewAmount: values.fakeViewAmount,
            });
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <Modal
            title={`Update View - ${article?.title || ''}`}
            open={visible}
            onOk={handleSubmit}
            onCancel={onCancel}
            destroyOnClose
            confirmLoading={loading}
            okText="Update"
            cancelText="Cancel"
            maskClosable={false}
            width={500}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    fakeViewAmount: 0,
                }}
            >
                <Form.Item
                    name="fakeViewAmount"
                    label="Fake View Amount"
                    rules={[
                        { required: true, message: 'Please enter fake view amount!' },
                        { type: 'number', min: 0, message: 'View amount must be 0 or greater!' }
                    ]}
                >
                    <InputNumber
                        placeholder="Enter fake view amount"
                        style={{ width: '100%' }}
                        min={0}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                </Form.Item>


            </Form>
        </Modal>
    );
}
