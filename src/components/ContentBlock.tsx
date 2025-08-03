'use client';

import { Button, Image } from 'antd';
import { DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
import type { ContentBlock } from '@/utils/contentBlocksUtils';
import { ImgComparisonSlider } from '@img-comparison-slider/react';

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
    const renderBlock = () => {
        console.log(block);
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
                            alt={block.caption || 'Article image'}
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
                            <img slot="first" src={block.leftImageUrl} alt={block.leftLabel || 'Left image'} />
                            <img slot="second" src={block.rightImageUrl} alt={block.rightLabel || 'Right image'} />
                        </ImgComparisonSlider>
                        {(block.leftLabel || block.rightLabel) && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                <span>{block.leftLabel}</span>
                                <span>{block.rightLabel}</span>
                            </div>
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
                    block.type === 'image' ? 'Image' : 'Compare'}
            </div>

            <div className="block-content">
                {renderBlock()}
            </div>
        </div>
    );
} 