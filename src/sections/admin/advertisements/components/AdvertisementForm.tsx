import { Form, Input, Modal, Select, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Advertisement } from '@/store/advertisement/crud';
import { Category } from '@/store/categories/crud';
import { useEffect, useState } from 'react';
import { imageCrud } from '@/store/image/crud';

interface AdvertisementFormProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (data: Omit<Advertisement, 'id' | 'createdAt'>) => Promise<void>;
    initialValues?: Advertisement | null;
    title: string;
    loading?: boolean;
    categories: Category[];
}

export default function AdvertisementForm({
    visible,
    onCancel,
    onSubmit,
    initialValues,
    title,
    loading = false,
    categories
}: AdvertisementFormProps) {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState<string>('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (visible) {
            form.resetFields();
            if (initialValues) {
                setImageUrl(initialValues.image || '');
                form.setFieldsValue({
                    ...initialValues,
                    categoryId: initialValues.categoryId
                });
            } else {
                setImageUrl('');
            }
        }
    }, [visible, initialValues, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const submitData = {
                ...values,
                image: imageUrl
            };
            await onSubmit(submitData);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleImageUpload = async (file: File) => {
        try {
            setUploading(true);
            const response = await imageCrud.createImage(file);
            setImageUrl(response.url);
            setUploading(false);
        } catch (error) {
            console.error('Upload failed:', error);
            setUploading(false);
        }
    };

    const uploadProps = {
        beforeUpload: (file: File) => {
            handleImageUpload(file);
            return false; // Prevent default upload
        },
        showUploadList: false,
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
                    rules={[{ required: true, message: 'Please enter advertisement title!' }]}
                >
                    <Input placeholder="Enter advertisement title" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                >
                    <Input.TextArea rows={4} placeholder="Enter advertisement description" />
                </Form.Item>

                <Form.Item
                    name="categoryId"
                    label="Category"
                    rules={[{ required: true, message: 'Please select a category!' }]}
                >
                    <Select placeholder="Select category">
                        {categories.map(category => (
                            <Select.Option key={category.id} value={category.id}>
                                {category.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="link"
                    label="Link"
                    rules={[
                        { type: 'url', message: 'Please enter a valid URL!' }
                    ]}
                >
                    <Input placeholder="https://example.com" />
                </Form.Item>

                <Form.Item
                    label="Image"
                >
                    <Upload {...uploadProps}>
                        <Button
                            icon={<UploadOutlined />}
                            loading={uploading}
                            disabled={uploading}
                        >
                            {uploading ? 'Uploading...' : 'Upload Image'}
                        </Button>
                    </Upload>
                    {imageUrl && (
                        <div style={{ marginTop: 8 }}>
                            <img
                                src={imageUrl}
                                alt="Preview"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: 200,
                                    objectFit: 'cover',
                                    borderRadius: 4
                                }}
                            />
                        </div>
                    )}
                </Form.Item>
            </Form>
        </Modal>
    );
} 