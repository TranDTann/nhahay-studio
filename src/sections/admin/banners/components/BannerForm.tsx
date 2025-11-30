import { Form, Input, Modal, Upload, Button, Switch } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Banner } from '@/store/banner/crud';
import { useEffect, useState } from 'react';
import { imageCrud } from '@/store/image/crud';

interface BannerFormProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (data: Omit<Banner, 'id' | 'createdAt' | 'redirectUrl'>) => Promise<void>;
    initialValues?: Banner | null;
    title: string;
    loading?: boolean;
}

export default function BannerForm({
    visible,
    onCancel,
    onSubmit,
    initialValues,
    title,
    loading = false,
}: BannerFormProps) {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState<string>('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (visible) {
            form.resetFields();
            if (initialValues) {
                setImageUrl(initialValues.imageUrl || '');
                form.setFieldsValue({ ...initialValues });
            } else {
                setImageUrl('');
            }
        } else {
            setImageUrl('');
        }
    }, [visible, initialValues, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            // Custom validation: require imageUrl
            if (!values.imageUrl) {
                form.setFields([
                    { name: 'imageUrl', errors: ['Please upload an image!'] }
                ]);
                return;
            }
            await onSubmit(values);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleImageUpload = async (file: File) => {
        try {
            setUploading(true);
            const response = await imageCrud.createImage(file);
            setImageUrl(response.url);
            form.setFieldsValue({ imageUrl: response.url }); // Đồng bộ với form
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
                initialValues={initialValues || { status: true }}
            >
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: 'Please enter banner title!' }]}
                >
                    <Input
                        placeholder="Enter banner title"
                        disabled={initialValues?.title === 'POPUP_BANNER'}
                    />
                </Form.Item>

                {/* Trường ẩn để đồng bộ imageUrl với form */}
                <Form.Item name="imageUrl" style={{ display: 'none' }}>
                    <Input type="hidden" />
                </Form.Item>

                <Form.Item
                    name="position"
                    label="Position"
                >
                    <Input placeholder="Enter banner position (e.g., header, sidebar, footer)" />
                </Form.Item>

                <Form.Item
                    name="redirectUrl"
                    label="Link"
                    rules={[
                        { type: 'url', message: 'Please enter a valid URL!' }
                    ]}
                >
                    <Input placeholder="https://example.com" />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Status"
                    valuePropName="checked"
                >
                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                </Form.Item>

                <Form.Item
                    label="Image"
                    required
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