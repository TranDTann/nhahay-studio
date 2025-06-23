'use client';

import { useState, useRef } from 'react';
import { Button, Image, message, Row, Col, Input, Tabs } from 'antd';
import { SwapOutlined, PictureOutlined, LinkOutlined } from '@ant-design/icons';
import { imageCrud } from '@/store/image/crud';

interface CompareImageBlockProps {
    onCompareImageAdd: (leftImageUrl: string, rightImageUrl: string, leftLabel?: string, rightLabel?: string) => void;
}

export default function CompareImageBlock({ onCompareImageAdd }: CompareImageBlockProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [leftImage, setLeftImage] = useState<string | null>(null);
    const [rightImage, setRightImage] = useState<string | null>(null);
    const [leftLabel, setLeftLabel] = useState('');
    const [rightLabel, setRightLabel] = useState('');
    const [leftImageUrl, setLeftImageUrl] = useState('');
    const [rightImageUrl, setRightImageUrl] = useState('');
    const leftFileInputRef = useRef<HTMLInputElement>(null);
    const rightFileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, side: 'left' | 'right') => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const response = await imageCrud.createImage(file);
            if (side === 'left') {
                setLeftImage(response.url);
            } else {
                setRightImage(response.url);
            }
        } catch (error: any) {
            message.error('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleUrlChange = (url: string, side: 'left' | 'right') => {
        if (side === 'left') {
            setLeftImageUrl(url);
            if (url.trim()) {
                setLeftImage(url);
            } else {
                setLeftImage(null);
            }
        } else {
            setRightImageUrl(url);
            if (url.trim()) {
                setRightImage(url);
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

    const leftUploadTab = (
        <div>
            <Button
                type="primary"
                onClick={() => leftFileInputRef.current?.click()}
                loading={isUploading}
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
                loading={isUploading}
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
        <div style={{ padding: '16px' }}>
            <Row gutter={16}>
                <Col span={12}>
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <h4>Left Image</h4>
                        {leftImage ? (
                            <Image
                                src={leftImage}
                                alt="Left preview"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '200px',
                                }}
                            />
                        ) : (
                            <div style={{
                                border: '2px dashed #d9d9d9',
                                padding: '20px',
                                borderRadius: '6px',
                                color: '#999'
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
                            <Image
                                src={rightImage}
                                alt="Right preview"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '200px',
                                }}
                            />
                        ) : (
                            <div style={{
                                border: '2px dashed #d9d9d9',
                                padding: '20px',
                                borderRadius: '6px',
                                color: '#999'
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