'use client';

import hljs from 'highlight.js/lib/core';
import css from 'highlight.js/lib/languages/css';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import { Select, Form, App, Space, Button, Divider, Dropdown, Modal } from 'antd';
import { useRouter } from 'next/navigation';
import paths from '@/routes/paths';
import { imageCrud } from '@/store/image/crud';
import { articleCrud } from '@/store/article/crud';
import { tagCrud } from '@/store/tags/crud';
import { categoryCrud } from '@/store/categories/crud';
import { advertisementCrud, Advertisement } from '@/store/advertisement/crud';
import { styleArticle } from '@/utils/styleArticle';
import { mergeContentBlocksToString, convertContentStringToBlocks, generateTextContent } from '@/utils/contentBlocksUtils';
import type { ContentBlock as ContentBlockType } from '@/utils/contentBlocksUtils';
import ImageBlock from '@/components/ImageBlock';
import CompareImageBlock from '@/components/CompareImageBlock';
import ContentBlock from '@/components/ContentBlock';
import ArticleRenderer from '@/components/ArticleRenderer';
import { PlusOutlined, PictureOutlined, SwapOutlined, FileTextOutlined } from '@ant-design/icons';

// Register highlight.js languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('java', java);

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>
});

interface Article {
    title: string;
    description: string;
    content: string;
    coverImage: string | null;
    coverImagePreview: string;
    categoryId?: string;
    tagIds?: string[];
    advertisementIds?: string[]; // Thêm trường advertisementIds
}

interface Category {
    id: string;
    name: string;
}

interface Tag {
    id: string;
    name: string;
}

interface FormBlogProps {
    id?: string;
}

type ContentBlock = ContentBlockType;

export default function FormBlog({ id }: FormBlogProps) {
    const router = useRouter();
    const { message: messageApi } = App.useApp();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const previewUrlRef = useRef<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showCompareModal, setShowCompareModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [editingTextBlock, setEditingTextBlock] = useState<string | null>(null);
    const [insertionIndex, setInsertionIndex] = useState<number | null>(null);
    const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);

    const [article, setArticle] = useState<Article>({
        title: '',
        description: '',
        content: '',
        coverImage: null,
        coverImagePreview: '',
        categoryId: undefined,
        tagIds: [],
        advertisementIds: [] // Thêm trường advertisementIds
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch tags, category, advertisements
                const res = await Promise.all([
                    tagCrud.getTags(),
                    categoryCrud.getCategory(),
                    advertisementCrud.getAdvertisements({ take: 100 })
                ])
                setTags(res[0].result?.map(tag => ({ ...tag, id: tag.id! })) || []);
                setCategories(res[1].result?.map(category => ({ ...category, id: category.id! })) || []);
                setAdvertisements(res[2].result || []);

                if (id && id !== 'new') {
                    // Fetch article detail
                    const articleRes = await articleCrud.getArticleById(id);
                    const detail = articleRes;
                    setArticle({
                        title: detail.title || '',
                        description: detail.description || '',
                        content: detail.content || '',
                        coverImage: detail.image || '',
                        coverImagePreview: detail.image || '',
                        categoryId: detail.category ? detail.category.id : undefined,
                        tagIds: Array.isArray(detail.tags) ? detail.tags.map(tag => tag.id) : [],
                        advertisementIds: detail.advertisements ? detail.advertisements.map((ad: any) => ad.id) : []
                    });

                    // Parse content blocks if they exist, otherwise convert from content
                    if (detail.contentBlocks && detail.contentBlocks.length > 0) {
                        setContentBlocks(detail.contentBlocks);
                    } else if (detail.content) {
                        // Convert content string back to content blocks
                        const blocks = convertContentStringToBlocks(detail.content);
                        setContentBlocks(blocks);
                    } else {
                        // Create initial text block
                        setContentBlocks([{
                            id: '1',
                            type: 'text',
                            content: ''
                        }]);
                    }
                } else {
                    // Create initial text block for new article
                    setContentBlocks([{
                        id: '1',
                        type: 'text',
                        content: ''
                    }]);
                    setEditingTextBlock('1');
                }
            } catch (error: any) {
                messageApi.error(error.response?.data?.message || 'Failed to fetch article detail');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        return () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
                previewUrlRef.current = null;
            }
        };
    }, []);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputEl = e.target as HTMLInputElement;
        const file = inputEl.files?.[0];
        if (!file) return;

        // Create a local preview immediately
        const objectUrl = URL.createObjectURL(file);
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
        }
        previewUrlRef.current = objectUrl;
        setArticle(prev => ({
            ...prev,
            coverImage: objectUrl,
            coverImagePreview: objectUrl
        }));

        try {
            setIsUploading(true);
            const response = await imageCrud.createImage(file);
            if (response && (response as any).url) {
                setArticle(prev => ({
                    ...prev,
                    coverImage: (response as any).url,
                    coverImagePreview: (response as any).url
                }));
                URL.revokeObjectURL(objectUrl);
                previewUrlRef.current = null;
                messageApi.success('Cover image uploaded successfully');
            } else {
                throw new Error('Invalid upload response');
            }
        } catch (error: any) {
            messageApi.error('Failed to upload cover image');
        } finally {
            setIsUploading(false);
            // Allow selecting the same file again next time
            if (inputEl) {
                inputEl.value = '';
            }
        }
    };

    const handleAddTextBlock = (index?: number) => {
        const newBlock: ContentBlock = {
            id: Date.now().toString(),
            type: 'text',
            content: ''
        };
        const targetIndex = index !== undefined ? index + 1 : contentBlocks.length;

        setContentBlocks(prev => {
            const newBlocks = [...prev];
            newBlocks.splice(targetIndex, 0, newBlock);
            return newBlocks;
        });
        setEditingTextBlock(newBlock.id);
        messageApi.success('Text block added successfully');
    };

    const handleAddImage = (imageUrl: string, caption?: string) => {
        const newBlock: ContentBlock = {
            id: Date.now().toString(),
            type: 'image',
            content: '',
            imageUrl,
            caption
        };
        const targetIndex = insertionIndex !== null ? insertionIndex : contentBlocks.length;
        setContentBlocks(prev => {
            const newBlocks = [...prev];
            newBlocks.splice(targetIndex, 0, newBlock);
            return newBlocks;
        });
        setInsertionIndex(null);
        messageApi.success('Image added successfully');
    };

    const handleAddCompareImage = (leftImageUrl: string, rightImageUrl: string, leftLabel?: string, rightLabel?: string) => {
        console.log(leftImageUrl, rightImageUrl, leftLabel, rightLabel);
        const newBlock: ContentBlock = {
            id: Date.now().toString(),
            type: 'compare',
            content: '',
            leftImageUrl,
            rightImageUrl,
            leftLabel,
            rightLabel
        };
        const targetIndex = insertionIndex !== null ? insertionIndex : contentBlocks.length;
        setContentBlocks(prev => {
            const newBlocks = [...prev];
            newBlocks.splice(targetIndex, 0, newBlock);
            return newBlocks;
        });
        setInsertionIndex(null);
        messageApi.success('Compare images added successfully');
    };

    const handleDeleteBlock = (blockId: string) => {
        setContentBlocks(prev => prev.filter(block => block.id !== blockId));
        messageApi.success('Block deleted successfully');
        setShowPreviewModal(true);
    };

    const handleEditBlock = (blockId: string) => {
        const block = contentBlocks.find(b => b.id === blockId);
        if (block?.type === 'text') {
            setEditingTextBlock(blockId);
        }
    };

    const handleTextBlockChange = (blockId: string, content: string) => {
        setContentBlocks(prev =>
            prev.map(block =>
                block.id === blockId
                    ? { ...block, content }
                    : block
            )
        );
    };

    const handleTextBlockSave = (blockId: string) => {
        setEditingTextBlock(null);
        messageApi.success('Text block saved');
    };

    const handleSave = async () => {
        if (!article.title.trim()) {
            messageApi.error('Please enter article title');
            return;
        }
        if (!article.description.trim()) {
            messageApi.error('Please enter article description');
            return;
        }
        if (!article.coverImagePreview) {
            messageApi.error('Please upload a cover image');
            return;
        }

        try {
            setIsSaving(true);
            let imageUrl = article.coverImagePreview;
            // If preview is a local object URL, ensure we upload and replace with remote URL
            const isObjectUrl = article.coverImagePreview.startsWith('blob:') || article.coverImagePreview.startsWith('media:');
            if (isObjectUrl && fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files[0]) {
                const uploadRes = await imageCrud.createImage(fileInputRef.current.files[0]);
                if (uploadRes && (uploadRes as any).url) {
                    imageUrl = (uploadRes as any).url;
                } else {
                    throw new Error('Cover image upload failed');
                }
            }

            // Merge content blocks into a single content string
            const mergedContent = mergeContentBlocksToString(contentBlocks);

            // Generate text-only content for backward compatibility
            const textContent = generateTextContent(contentBlocks);

            const articleData = {
                title: article.title,
                description: article.description,
                content: mergedContent, // Use merged content as main content
                textContent: textContent, // Keep text-only content for backward compatibility
                image: imageUrl,
                tagIds: article.tagIds,
                categoryId: article.categoryId,
                contentBlocks: contentBlocks, // Keep blocks for future use
                advertisementIds: article.advertisementIds // Thêm advertisementIds vào payload
            }

            if (id && id !== 'new') {
                // Update existing article
                await articleCrud.updateArticle(id, articleData);
                messageApi.success('Article updated successfully');
            } else {
                // Create new article
                await articleCrud.createArticle(articleData as any);
                messageApi.success('Article created successfully');
            }

            router.push(paths.admin.articles());
        } catch (error: any) {
            console.error('Error saving article:', error);
            messageApi.error(error.response?.data?.message || 'Failed to save article');
        } finally {
            setIsSaving(false);
        }
    };

    const previewHtml = () => {
        setShowPreviewModal(true);
    };

    const getDropdownItems = (index?: number) => [
        {
            key: 'text',
            label: 'Add Text Block',
            icon: <FileTextOutlined />,
            onClick: () => handleAddTextBlock(index)
        },
        {
            key: 'image',
            label: 'Add Image',
            icon: <PictureOutlined />,
            onClick: () => {
                const targetIndex = index !== undefined ? index + 1 : contentBlocks.length;
                setInsertionIndex(targetIndex);
                setShowImageModal(true);
            }
        },
        {
            key: 'compare',
            label: 'Add Compare Images',
            icon: <SwapOutlined />,
            onClick: () => {
                const targetIndex = index !== undefined ? index + 1 : contentBlocks.length;
                setInsertionIndex(targetIndex);
                setShowCompareModal(true);
            }
        }
    ];

    if (isLoading) {
        return (
            <div className="loading-container">
                <div>
                    <div className="loading-spinner"></div>
                    <div className="loading-text">Loading editor...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="article-form">
            {id && id !== 'new' && (
                <Button
                    type="default"
                    onClick={() => router.push(paths.admin.articleView(id))}
                    style={{ marginBottom: 16 }}
                >
                    ← Back
                </Button>
            )}
            <h1>{id === 'new' ? 'Create Article' : 'Edit Article'}</h1>

            <div className="form-group">
                <label className="form-label" htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    className="form-input"
                    value={article.title}
                    onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter article title"
                />
            </div>

            <div className="form-group">
                <label className="form-label">Cover Image</label>
                <div className="image-upload">
                    <div
                        className={`image-preview ${article.coverImage ? 'has-image' : ''}`}
                    >
                        {article.coverImage ? (
                            <img
                                src={article.coverImage}
                                alt="Cover preview"
                            />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 5V19M5 12H19" stroke="#666" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        )}
                        <label className="upload-button" htmlFor="cover-image">
                            {isUploading ? (
                                <div className="loading-spinner small"></div>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 5V19M5 12H19" stroke="#666" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            )}
                            {isUploading ? 'Uploading...' : 'Upload Cover Image'}
                        </label>
                    </div>
                    <input
                        id="cover-image"
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        disabled={isUploading}
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="description">Description</label>
                <textarea
                    id="description"
                    className="form-input form-textarea"
                    value={article.description}
                    onChange={(e) => setArticle(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter article description"
                />
            </div>

            <div className="form-group">
                <label className="form-label">Category</label>
                <Select
                    style={{ width: '100%' }}
                    value={article.categoryId}
                    onChange={(value: string) => setArticle(prev => ({ ...prev, categoryId: value }))}
                    placeholder="Select category"
                >
                    {categories.map(category => (
                        <Select.Option key={category.id} value={category.id}>
                            {category.name}
                        </Select.Option>
                    ))}
                </Select>
            </div>

            <div className="form-group">
                <label className="form-label">Tags</label>
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    value={article.tagIds}
                    onChange={(values: string[]) => setArticle(prev => ({ ...prev, tagIds: values }))}
                    placeholder="Select tags"
                >
                    {tags.map(tag => (
                        <Select.Option key={tag.id} value={tag.id}>
                            {tag.name}
                        </Select.Option>
                    ))}
                </Select>
            </div>

            <div className="form-group">
                <label className="form-label">Advertisements</label>
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    value={article.advertisementIds}
                    onChange={(values: string[]) => setArticle(prev => ({ ...prev, advertisementIds: values }))}
                    placeholder="Select advertisements to insert into the article"
                >
                    {advertisements.map(ad => (
                        <Select.Option key={ad.id} value={ad.id!}>
                            {ad.title}
                        </Select.Option>
                    ))}
                </Select>
            </div>

            <div className="form-group">
                <label className="form-label">Content</label>
                <div className="content-preview">
                    {contentBlocks.map((block, index) => (
                        <div key={block.id}>
                            <ContentBlock
                                block={block}
                                onDelete={handleDeleteBlock}
                                onEdit={handleEditBlock}
                                isEditing={editingTextBlock === block.id}
                                onTextChange={(content) => handleTextBlockChange(block.id, content)}
                                onTextSave={() => handleTextBlockSave(block.id)}
                            />
                            <div style={{ textAlign: 'center', margin: '16px 0' }}>
                                <Dropdown
                                    menu={{
                                        items: getDropdownItems(index).map(item => ({
                                            key: item.key,
                                            label: (
                                                <div onClick={item.onClick} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {item.icon}
                                                    {item.label}
                                                </div>
                                            )
                                        }))
                                    }}
                                    trigger={['click']}
                                >
                                    <Button
                                        type="dashed"
                                        icon={<PlusOutlined />}
                                    >
                                        Add block here
                                    </Button>
                                </Dropdown>
                            </div>
                        </div>
                    ))}
                    {contentBlocks.length === 0 && (
                        <div className="preview-placeholder" style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            border: '2px dashed #d9d9d9',
                            borderRadius: '8px',
                            backgroundColor: '#fafafa'
                        }}>
                            <div style={{ marginBottom: '24px' }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#bfbfbf', marginBottom: '16px' }}>
                                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <h3 style={{ color: '#8c8c8c', margin: '0 0 8px 0', fontSize: '18px' }}>No content yet</h3>
                                <p style={{ color: '#bfbfbf', margin: 0, fontSize: '14px' }}>Start building your article by adding content blocks</p>
                            </div>
                            <Dropdown
                                menu={{
                                    items: getDropdownItems().map(item => ({
                                        key: item.key,
                                        label: (
                                            <div onClick={item.onClick} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {item.icon}
                                                {item.label}
                                            </div>
                                        )
                                    }))
                                }}
                                trigger={['click']}
                            >
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    size="large"
                                    style={{
                                        height: '48px',
                                        padding: '0 32px',
                                        fontSize: '16px',
                                        fontWeight: '500',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)'
                                    }}
                                >
                                    Add Content Block
                                </Button>
                            </Dropdown>
                        </div>
                    )}
                </div>
            </div>



            <div className="button-container">
                <button
                    className="preview-button"
                    onClick={previewHtml}
                    disabled={isSaving}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor" />
                    </svg>
                    Preview
                </button>
                <button
                    className="preview-button save-button"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <>
                            <div className="loading-spinner small"></div>
                            Saving...
                        </>
                    ) : (
                        'Save Article'
                    )}
                </button>
            </div>

            {/* Preview Modal */}
            <Modal
                title="Article Preview"
                open={showPreviewModal}
                onCancel={() => setShowPreviewModal(false)}
                footer={null}
                width="80%"
                style={{ top: 20 }}
            >
                <div className="modal-content">
                    <h1>{article.title}</h1>
                    <p className="modal-description">
                        {article.description}
                    </p>
                    <ArticleRenderer
                        content=""
                        contentBlocks={contentBlocks}
                    />
                </div>
            </Modal>

            {/* Image Modal */}
            <Modal
                title="Add Image"
                open={showImageModal}
                onCancel={() => {
                    setShowImageModal(false);
                    setInsertionIndex(null);
                }}
                footer={null}
                width={600}
            >
                <ImageBlock
                    onImageAdd={(imageUrl, caption) => {
                        handleAddImage(imageUrl, caption);
                        setShowImageModal(false);
                    }}
                />
            </Modal>

            {/* Compare Image Modal */}
            <Modal
                title="Add Compare Images"
                open={showCompareModal}
                onCancel={() => {
                    setShowCompareModal(false);
                    setInsertionIndex(null);
                }}
                footer={null}
                width={800}
            >
                <CompareImageBlock
                    onCompareImageAdd={(leftImageUrl, rightImageUrl, leftLabel, rightLabel) => {
                        handleAddCompareImage(leftImageUrl, rightImageUrl, leftLabel, rightLabel);
                        setShowCompareModal(false);
                    }}
                />
            </Modal>
        </div>
    );
}