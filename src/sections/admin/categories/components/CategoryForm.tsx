import { Form, Input, Modal, Upload, Button, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Category } from '@/store/categories/crud';
import { useEffect, useState } from 'react';
import { imageCrud } from '@/store/image/crud';
import { bannerCrud, Banner } from '@/store/banner/crud';

interface CategoryFormProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (data: { name: string; description?: string; urlThumbnail?: string; bannerIds?: string[] }) => Promise<void>;
    initialValues?: Category | null;
    title: string;
    loading?: boolean;
}

export default function CategoryForm({ visible, onCancel, onSubmit, initialValues, title, loading = false }: CategoryFormProps) {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [banners, setBanners] = useState<Banner[]>([]);

    useEffect(() => {
        if (visible) {
            form.resetFields();
            // Fetch banners when modal opens
            const fetchBanners = async () => {
                try {
                    const response = await bannerCrud.getBanners({ take: 100 });
                    if (response && response.result) {
                        setBanners(response.result);
                    }
                } catch (error) {
                    console.error('Failed to fetch banners:', error);
                }
            };
            fetchBanners();

            if (initialValues) {
                setImageUrl(initialValues.urlThumbnail || '');
                // Set bannerIds if category has banners
                const bannerIds = (initialValues as any).banners?.map((b: any) => b.id) || (initialValues as any).bannerIds || [];
                form.setFieldsValue({
                    ...initialValues,
                    bannerIds: bannerIds
                });
            } else {
                setImageUrl('');
            }
        } else {
            setImageUrl('');
        }
    }, [visible, initialValues, form]);
    // region methods
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await onSubmit({
                name: values.name,
                description: values.description,
                urlThumbnail: imageUrl,
                bannerIds: values.bannerIds || []
            });
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleImageUpload = async (file: File) => {
        try {
            setUploading(true);
            const response = await imageCrud.createImage(file);
            setImageUrl(response.url);
            form.setFieldsValue({ urlThumbnail: response.url }); // Đồng bộ với form
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

                {/* Trường ẩn để đồng bộ urlThumbnail với form */}
                <Form.Item name="urlThumbnail" style={{ display: 'none' }}>
                    <Input type="hidden" />
                </Form.Item>

                <Form.Item
                    label="Thumbnail Image"
                >
                    <Upload {...uploadProps}>
                        <Button
                            icon={<UploadOutlined />}
                            loading={uploading}
                            disabled={uploading}
                        >
                            {uploading ? 'Uploading...' : 'Upload Thumbnail'}
                        </Button>
                    </Upload>
                    {imageUrl && (
                        <div style={{ marginTop: 8 }}>
                            <img
                                src={imageUrl}
                                alt="Thumbnail Preview"
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

                <Form.Item
                    name="bannerIds"
                    label="Banners"
                >
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Select banners"
                        allowClear
                    >
                        {banners.map(banner => (
                            <Select.Option key={banner.id} value={banner.id!}>
                                {banner.title}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
} 