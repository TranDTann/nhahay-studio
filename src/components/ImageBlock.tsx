'use client';

import { useState, useRef } from 'react';
import { Button, Image, message, Input, Tabs } from 'antd';
import { PictureOutlined, LinkOutlined } from '@ant-design/icons';
import { imageCrud } from '@/store/image/crud';

interface ImageBlockProps {
    onImageAdd: (imageUrl: string, caption?: string, imageAlt?: string, imageTitle?: string) => void;
}

export default function ImageBlock({ onImageAdd }: ImageBlockProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    const [imageTitle, setImageTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const response = await imageCrud.createImage(file);
            setSelectedImage(response.url);
        } catch (error: any) {
            message.error('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleUrlChange = (url: string) => {
        setImageUrl(url);
        if (url.trim()) {
            setSelectedImage(url);
        } else {
            setSelectedImage(null);
        }
    };

    const handleAddImage = () => {
        if (selectedImage) {
            onImageAdd(selectedImage, caption, imageAlt || undefined, imageTitle || undefined);
            setSelectedImage(null);
            setCaption('');
            setImageAlt('');
            setImageTitle('');
            setImageUrl('');
        }
    };

    const canAdd = selectedImage;

    const uploadTab = (
        <div>
            <Button
                type="primary"
                onClick={() => fileInputRef.current?.click()}
                loading={isUploading}
                icon={<PictureOutlined />}
                style={{ width: '100%', marginBottom: '16px' }}
            >
                Select Image
            </Button>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
            />
        </div>
    );

    const urlTab = (
        <div>
            <Input
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                value={imageUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                prefix={<LinkOutlined />}
                style={{ marginBottom: '16px' }}
            />
        </div>
    );

    const items = [
        {
            key: 'upload',
            label: 'Upload File',
            children: uploadTab,
        },
        {
            key: 'url',
            label: 'Image URL',
            children: urlTab,
        },
    ];

    return (
        <div style={{ padding: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <h4>Image Preview</h4>
                {selectedImage ? (
                    <Image
                        src={selectedImage}
                        alt="Preview"
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

            <Tabs items={items} style={{ marginBottom: '16px' }} />

            <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Caption (optional)
                </label>
                <Input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Enter image caption"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Alt (SEO)</label>
                    <Input
                        type="text"
                        value={imageAlt}
                        onChange={(e) => setImageAlt(e.target.value)}
                        placeholder="Describe the image"
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Title (SEO)</label>
                    <Input
                        type="text"
                        value={imageTitle}
                        onChange={(e) => setImageTitle(e.target.value)}
                        placeholder="Optional title tooltip"
                    />
                </div>
            </div>

            <Button
                type="primary"
                onClick={handleAddImage}
                disabled={!canAdd}
                style={{ width: '100%' }}
            >
                Add Image
            </Button>
        </div>
    );
} 