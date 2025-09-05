'use client';

import { imageCrud } from '@/store/image/crud';
import { LinkOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, Col, Image, Input, message, Row, Select, Tabs } from 'antd';
import { useRef, useState } from 'react';

interface CompareImageBlockProps {
    onCompareImageAdd: (leftImageUrl: string, rightImageUrl: string, leftLabel?: string, rightLabel?: string) => void;
}

// Hàm resize ảnh để đồng bộ kích thước
const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = document.createElement('img');

        img.onload = () => {
            // Tính toán tỷ lệ để giữ nguyên aspect ratio
            const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
            const newWidth = img.width * ratio;
            const newHeight = img.height * ratio;

            canvas.width = newWidth;
            canvas.height = newHeight;

            // Vẽ ảnh đã resize lên canvas
            ctx?.drawImage(img, 0, 0, newWidth, newHeight);

            // Chuyển đổi thành blob URL
            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    resolve(url);
                }
            }, 'image/jpeg', 0.8);
        };

        img.src = URL.createObjectURL(file);
    });
};

export default function CompareImageBlock({ onCompareImageAdd }: CompareImageBlockProps) {
    const [isLeftUploading, setIsLeftUploading] = useState(false);
    const [isRightUploading, setIsRightUploading] = useState(false);
    const [leftImage, setLeftImage] = useState<string | null>(null);
    const [rightImage, setRightImage] = useState<string | null>(null);
    const [leftLabel, setLeftLabel] = useState('');
    const [rightLabel, setRightLabel] = useState('');
    const [leftImageUrl, setLeftImageUrl] = useState('');
    const [rightImageUrl, setRightImageUrl] = useState('');
    const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 400, height: 300 });
    const leftFileInputRef = useRef<HTMLInputElement>(null);
    const rightFileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, side: 'left' | 'right') => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // Set loading state cho button tương ứng
            if (side === 'left') {
                setIsLeftUploading(true);
            } else {
                setIsRightUploading(true);
            }

            // Resize ảnh trước khi upload để đồng bộ kích thước
            const resizedImageUrl = await resizeImage(file, imageSize.width, imageSize.height);

            // Upload ảnh đã resize
            const response = await imageCrud.createImage(file);

            if (side === 'left') {
                setLeftImage(resizedImageUrl);
            } else {
                setRightImage(resizedImageUrl);
            }
        } catch (error: any) {
            message.error('Failed to upload image');
        } finally {
            // Reset loading state cho button tương ứng
            if (side === 'left') {
                setIsLeftUploading(false);
            } else {
                setIsRightUploading(false);
            }
        }
    };

    const handleUrlChange = async (url: string, side: 'left' | 'right') => {
        if (side === 'left') {
            setLeftImageUrl(url);
            if (url.trim()) {
                // Tạo một ảnh tạm thời để lấy kích thước và resize
                try {
                    const img = document.createElement('img');
                    img.crossOrigin = 'anonymous';
                    img.onload = async () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');

                        canvas.width = imageSize.width;
                        canvas.height = imageSize.height;

                        // Vẽ ảnh với kích thước mới
                        ctx?.drawImage(img, 0, 0, imageSize.width, imageSize.height);

                        const resizedUrl = canvas.toDataURL('image/jpeg', 0.8);
                        setLeftImage(resizedUrl);
                    };
                    img.src = url;
                } catch (error) {
                    setLeftImage(url);
                }
            } else {
                setLeftImage(null);
            }
        } else {
            setRightImageUrl(url);
            if (url.trim()) {
                try {
                    const img = document.createElement('img');
                    img.crossOrigin = 'anonymous';
                    img.onload = async () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');

                        canvas.width = imageSize.width;
                        canvas.height = imageSize.height;

                        ctx?.drawImage(img, 0, 0, imageSize.width, imageSize.height);

                        const resizedUrl = canvas.toDataURL('image/jpeg', 0.8);
                        setRightImage(resizedUrl);
                    };
                    img.src = url;
                } catch (error) {
                    setRightImage(url);
                }
            } else {
                setRightImage(null);
            }
        }
    };

    const handleAddCompareImage = () => {
        if (leftImage && rightImage) {
            onCompareImageAdd(leftImage, rightImage, leftLabel, rightLabel);
            setLeftImage(null);
            setRightImage(null);
            setLeftLabel('');
            setRightLabel('');
            setLeftImageUrl('');
            setRightImageUrl('');
        }
    };

    const canAdd = leftImage && rightImage;

    // Các preset kích thước ảnh
    const sizePresets = [
        { label: 'Small (300x200)', value: { width: 300, height: 200 } },
        { label: 'Medium (400x300)', value: { width: 400, height: 300 } },
        { label: 'Large (600x400)', value: { width: 600, height: 400 } },
        { label: 'Square (400x400)', value: { width: 400, height: 400 } },
    ];

    const leftUploadTab = (
        <div>
            <Button
                type="primary"
                onClick={() => leftFileInputRef.current?.click()}
                loading={isLeftUploading}
                style={{ width: '100%', marginBottom: '8px' }}
            >
                Select Left Image
            </Button>
            <input
                ref={leftFileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'left')}
                style={{ display: 'none' }}
            />
        </div>
    );

    const leftUrlTab = (
        <div>
            <Input
                placeholder="Enter left image URL"
                value={leftImageUrl}
                onChange={(e) => handleUrlChange(e.target.value, 'left')}
                prefix={<LinkOutlined />}
                style={{ marginBottom: '8px' }}
            />
        </div>
    );

    const rightUploadTab = (
        <div>
            <Button
                type="primary"
                onClick={() => rightFileInputRef.current?.click()}
                loading={isRightUploading}
                style={{ width: '100%', marginBottom: '8px' }}
            >
                Select Right Image
            </Button>
            <input
                ref={rightFileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'right')}
                style={{ display: 'none' }}
            />
        </div>
    );

    const rightUrlTab = (
        <div>
            <Input
                placeholder="Enter right image URL"
                value={rightImageUrl}
                onChange={(e) => handleUrlChange(e.target.value, 'right')}
                prefix={<LinkOutlined />}
                style={{ marginBottom: '8px' }}
            />
        </div>
    );

    const leftItems = [
        {
            key: 'upload',
            label: 'Upload File',
            children: leftUploadTab,
        },
        {
            key: 'url',
            label: 'Image URL',
            children: leftUrlTab,
        },
    ];

    const rightItems = [
        {
            key: 'upload',
            label: 'Upload File',
            children: rightUploadTab,
        },
        {
            key: 'url',
            label: 'Image URL',
            children: rightUrlTab,
        },
    ];

    return (
        <div style={{
            padding: '16px',
            width: '100%',
            maxWidth: '800px'
        }}>
            {/* Image Size Configuration */}
            <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                <h4>Image Size Configuration</h4>
                <Select
                    value={`${imageSize.width}x${imageSize.height}`}
                    onChange={(value) => {
                        const [width, height] = value.split('x').map(Number);
                        setImageSize({ width, height });
                    }}
                    style={{ width: 200 }}
                    options={sizePresets.map(preset => ({
                        label: preset.label,
                        value: `${preset.value.width}x${preset.value.height}`
                    }))}
                />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '8px'
                }}>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                        Target size: <strong>{imageSize.width} × {imageSize.height}</strong>
                    </span>
                    <span style={{ fontSize: '12px', color: '#999' }}>|</span>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                        Preview: <strong>Responsive</strong>
                    </span>
                </div>
            </div>

            <Row gutter={16}>
                <Col span={12}>
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <h4>Left Image</h4>
                        {leftImage ? (
                            <div style={{
                                maxWidth: '100%',
                                maxHeight: '300px',
                                margin: '0 auto',
                                border: '1px solid #d9d9d9',
                                borderRadius: '6px',
                                overflow: 'hidden',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Image
                                    src={leftImage}
                                    alt="Left preview"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '300px',
                                        objectFit: 'contain'
                                    }}
                                    preview={{
                                        mask: 'Click to preview',
                                        maskClassName: 'custom-preview-mask'
                                    }}
                                />
                            </div>
                        ) : (
                            <div style={{
                                width: '200px',
                                height: '150px',
                                border: '2px dashed #d9d9d9',
                                borderRadius: '6px',
                                color: '#999',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto'
                            }}>
                                No image selected
                            </div>
                        )}
                    </div>
                    <Tabs items={leftItems} size="small" style={{ marginBottom: '8px' }} />
                    <Input
                        type="text"
                        value={leftLabel}
                        onChange={(e) => setLeftLabel(e.target.value)}
                        placeholder="Left image label (optional)"
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d9d9d9',
                            borderRadius: '6px',
                            fontSize: '14px'
                        }}
                    />
                </Col>
                <Col span={12}>
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <h4>Right Image</h4>
                        {rightImage ? (
                            <div style={{
                                maxWidth: '100%',
                                maxHeight: '300px',
                                margin: '0 auto',
                                border: '1px solid #d9d9d9',
                                borderRadius: '6px',
                                overflow: 'hidden',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Image
                                    src={rightImage}
                                    alt="Right preview"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '300px',
                                        objectFit: 'contain'
                                    }}
                                    preview={{
                                        mask: 'Click to preview',
                                        maskClassName: 'custom-preview-mask'
                                    }}
                                />
                            </div>
                        ) : (
                            <div style={{
                                width: '200px',
                                height: '150px',
                                border: '2px dashed #d9d9d9',
                                borderRadius: '6px',
                                color: '#999',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto'
                            }}>
                                No image selected
                            </div>
                        )}
                    </div>
                    <Tabs items={rightItems} size="small" style={{ marginBottom: '8px' }} />
                    <Input
                        type="text"
                        value={rightLabel}
                        onChange={(e) => setRightLabel(e.target.value)}
                        placeholder="Right image label (optional)"
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d9d9d9',
                            borderRadius: '6px',
                            fontSize: '14px'
                        }}
                    />
                </Col>
            </Row>

            <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <Button
                    type="primary"
                    onClick={handleAddCompareImage}
                    disabled={!canAdd}
                    icon={<SwapOutlined />}
                    style={{ width: '100%' }}
                >
                    Add Compare Images
                </Button>
            </div>
        </div>
    );
} 