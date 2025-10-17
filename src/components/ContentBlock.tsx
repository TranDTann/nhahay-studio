'use client';

import { Button, Image } from 'antd';
import { DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
import type { ContentBlock } from '@/utils/contentBlocksUtils';
import { ImgComparisonSlider } from '@img-comparison-slider/react';
import { useState } from 'react';

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>
});

interface ContentBlockProps {
    block: ContentBlock;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    isEditing?: boolean;
    onTextChange?: (content: string) => void;
    onTextSave?: () => void;
}

export default function ContentBlock({
    block,
    onDelete,
    onEdit,
    isEditing = false,
    onTextChange,
    onTextSave
}: ContentBlockProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const renderBlock = () => {
        switch (block.type) {
            case 'text':
                if (isEditing) {
                    return (
                        <div className="content-text-editor">
                            <ReactQuill
                                theme="snow"
                                value={block.content}
                                onChange={(content) => onTextChange?.(content)}
                                modules={{
                                    toolbar: [
                                        [{ header: [1, 2, 3, false] }],
                                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                        [{ align: ['', 'center', 'right', 'justify'] }],
                                        [{ color: [] }, { background: [] }],
                                        [
                                            { list: 'ordered' },
                                            { list: 'bullet' },
                                            { indent: '-1' },
                                            { indent: '+1' }
                                        ],
                                        ['link', 'code-block'],
                                        ['clean']
                                    ]
                                }}
                            />
                            <div className="text-editor-actions">
                                <Button
                                    type="primary"
                                    icon={<SaveOutlined />}
                                    onClick={onTextSave}
                                    size="small"
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    );
                }
                return (
                    <div
                        className="content-text"
                        dangerouslySetInnerHTML={{ __html: block.content }}
                    />
                );

            case 'image':
                return (
                    <div className="content-image">
                        <Image
                            src={block.imageUrl}
                            alt={block.imageAlt || block.caption || 'Article image'}
                            title={block.imageTitle}
                            className="content-image-img"
                        />
                        {block.caption && (
                            <p className="image-caption">
                                {block.caption}
                            </p>
                        )}
                    </div>
                );

            case 'compare':
                return (
                    <div className="content-compare">
                        <ImgComparisonSlider>
                            <img slot="first" src={block.leftImageUrl} alt={block.leftAlt || block.leftLabel || 'Left image'} />
                            <img slot="second" src={block.rightImageUrl} alt={block.rightAlt || block.rightLabel || 'Right image'} />
                        </ImgComparisonSlider>
                        {(block.leftLabel || block.rightLabel) && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                <span>{block.leftLabel}</span>
                                <span>{block.rightLabel}</span>
                            </div>
                        )}
                    </div>
                );

            case 'youtube':
                return (
                    <div className="content-youtube" style={{ margin: '24px auto', position: 'relative', width: '100%', maxWidth: 800, aspectRatio: '16/9' }}>
                        {!isPlaying ? (
                            <button
                                type="button"
                                onClick={() => setIsPlaying(true)}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 0,
                                    padding: 0,
                                    cursor: 'pointer',
                                    position: 'relative',
                                    background: 'transparent'
                                }}
                                aria-label="Play YouTube video"
                                title={block.youtubeTitle}
                            >
                                <img
                                    src={`https://i.ytimg.com/vi/${block.youtubeId}/hqdefault.jpg`}
                                    alt={block.youtubeTitle || 'YouTube thumbnail'}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                                />
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: 68,
                                        height: 48,
                                        background: 'rgba(0,0,0,0.6)',
                                        borderRadius: 8,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff'
                                    }}
                                >
                                    ▶
                                </span>
                            </button>
                        ) : (
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${block.youtubeId}?autoplay=1`}
                                title={block.youtubeTitle || 'YouTube video player'}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                style={{ border: 0, borderRadius: 8 }}
                            />
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    const getBlockTypeColor = () => {
        switch (block.type) {
            case 'text': return '#52c41a';
            case 'image': return '#1890ff';
            case 'compare': return '#faad14';
            case 'youtube': return '#ff4d4f';
            default: return '#666';
        }
    };

    return (
        <div className="content-block">
            <div className="block-actions">
                {!isEditing && block.type === 'text' && (
                    <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(block.id)}
                        className="edit-button"
                    />
                )}
                <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => onDelete(block.id)}
                    className="delete-button"
                />
            </div>

            <div
                className="block-type-badge"
                style={{ backgroundColor: getBlockTypeColor() }}
            >
                {block.type === 'text' ? 'Text' :
                    block.type === 'image' ? 'Image' :
                        block.type === 'compare' ? 'Compare' : 'YouTube'}
            </div>

            <div className="block-content">
                {renderBlock()}
            </div>
        </div>
    );
} 