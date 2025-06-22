'use client';

import hljs from 'highlight.js/lib/core';
import css from 'highlight.js/lib/languages/css';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import { Select, Form, App } from 'antd';
import { useRouter } from 'next/navigation';
import paths from '@/routes/paths';
import { imageCrud } from '@/store/image/crud';
import { articleCrud } from '@/store/article/crud';
import { tagCrud } from '@/store/tags/crud';
import { categoryCrud } from '@/store/categories/crud';
import { styleArticle } from '@/utils/styleArticle';

// Register highlight.js languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('java', java);
hljs.registerLanguage('css', css);

// Dynamic import for ReactQuill
const ReactQuill = dynamic(
    async () => {
        const { default: RQ } = await import('react-quill-new');
        return RQ;
    },
    {
        ssr: false,
        loading: () => <p>Loading...</p>
    }
);

interface Article {
    title: string;
    description: string;
    content: string;
    coverImage: string | null;
    coverImagePreview: string;
    categoryId?: string;
    tagIds?: string[];
}

interface Category {
    id: string;
    name: string;
}

interface Tag {
    id: string;
    name: string;
}

interface QuillModules {
    [key: string]: unknown;
    toolbar: Array<any>;
    imageResize?: any;
}

interface FormBlogProps {
    id?: string;
}

export default function FormBlog({ id }: FormBlogProps) {
    const router = useRouter();
    const { message: messageApi } = App.useApp();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [text, setText] = useState('');
    const [quillInstance, setQuillInstance] = useState<any>(null);
    const [editorHtml, setEditorHtml] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);

    const [article, setArticle] = useState<Article>({
        title: '',
        description: '',
        content: '',
        coverImage: null,
        coverImagePreview: '',
        categoryId: undefined,
        tagIds: []
    });

    const [modules, setModules] = useState<QuillModules>({
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
            ['link', 'image', 'code-block'],
            ['clean']
        ]
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch tags, category
                const res = await Promise.all([
                    tagCrud.getTags(),
                    categoryCrud.getCategory()
                ])
                setTags(res[0].result?.map(tag => ({ ...tag, id: tag.id! })) || []);
                setCategories(res[1].result?.map(category => ({ ...category, id: category.id! })) || []);

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
                        categoryId: detail.categoryId || undefined,
                        tagIds: detail.tags || [],
                    });
                    setText(detail.content || '');
                    setEditorHtml(detail.content || '');
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
        // Register the image resize module after component mounts
        const registerImageResize = async () => {
            if (typeof window !== 'undefined') {
                const Quill = (await import('react-quill-new')).default.Quill;
                const ImageResize = (await import('quill-resize-image')).default;
                Quill.register('modules/imageResize', ImageResize);

                // Update modules after registration
                setModules(prev => ({
                    ...prev,
                    imageResize: {
                        modules: ['Resize', 'DisplaySize'],
                        displayStyles: {
                            backgroundColor: 'black',
                            border: 'none',
                            color: 'white'
                        },
                        handleStyles: {
                            backgroundColor: 'black',
                            border: 'none',
                            color: 'white'
                        }
                    }
                }));

                // Set loading to false after module registration
                setIsLoading(false);
            }
        };

        registerImageResize();

        // Add required styles for preview
        const style = document.createElement('style');
        style.innerHTML = styleArticle;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const handleQuillChange = (content: string) => {
        setText(content);
        setEditorHtml(content);
        setArticle(prev => ({ ...prev, content }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                setIsUploading(true);
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    setArticle(prev => ({
                        ...prev,
                        coverImage: base64String
                    }));
                    setIsUploading(false);
                };
                reader.onerror = () => {
                    messageApi.error('Failed to read image file');
                    setIsUploading(false);
                };
                reader.readAsDataURL(file);
            } catch (error) {
                messageApi.error('Failed to process image');
                setIsUploading(false);
            }
        }
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
        if (!article.content.trim()) {
            messageApi.error('Please enter article content');
            return;
        }
        if (!article.coverImagePreview) {
            messageApi.error('Please upload a cover image');
            return;
        }

        try {
            setIsSaving(true);
            let imageUrl = article.coverImagePreview;

            // Only process new image if coverImage is base64 (new upload)
            if (article.coverImage && article.coverImage.startsWith('data:image')) {
                // Convert base64 to File
                const base64Data = article.coverImage.split(',')[1];
                const byteCharacters = atob(base64Data);
                const byteArrays = [];
                for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                    const slice = byteCharacters.slice(offset, offset + 512);
                    const byteNumbers = new Array(slice.length);
                    for (let i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    byteArrays.push(byteArray);
                }
                const blob = new Blob(byteArrays, { type: 'image/jpeg' });
                const file = new File([blob], 'cover-image.jpg', { type: 'image/jpeg' });

                const imageResponse = await imageCrud.createImage(file);
                imageUrl = imageResponse.url;
            }

            const articleData = {
                title: article.title,
                description: article.description,
                content: article.content,
                image: imageUrl,
                tags: article.tagIds,
            }

            if (id && id !== 'new') {
                // Update existing article
                await articleCrud.updateArticle(id, articleData);
                messageApi.success('Article updated successfully');
            } else {
                // Create new article
                await articleCrud.createArticle(articleData);
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
        const preview = document.querySelector('.preview');
        if (preview) {
            preview.innerHTML = editorHtml;

            preview.querySelectorAll('pre').forEach((p) => {
                hljs.highlightBlock(p);
            });

            preview.querySelectorAll('p').forEach((p) => {
                const style = p.getAttribute('style') || '';
                if (style.includes('text-align: center')) {
                    p.setAttribute('data-align', 'center');
                } else if (style.includes('text-align: right')) {
                    p.setAttribute('data-align', 'right');
                } else if (style.includes('text-align: justify')) {
                    p.setAttribute('data-align', 'justify');
                }
            });
        }
    };

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
        <div className="article-form" style={{ padding: '24px' }}>
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
                    <img
                        src={article.coverImage || '/placeholder-image.jpg'}
                        alt="Cover preview"
                        className={`image-preview ${article.coverImage ? 'has-image' : ''}`}
                    />
                    <label className="upload-button" htmlFor="cover-image">
                        {isUploading ? (
                            <div className="loading-spinner" style={{ width: '20px', height: '20px' }}></div>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 5V19M5 12H19" stroke="#666" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        )}
                        {isUploading ? 'Uploading...' : 'Upload Cover Image'}
                    </label>
                    <input
                        id="cover-image"
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        style={{ display: 'none' }}
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
                <label className="form-label">Content</label>
                <ReactQuill
                    theme="snow"
                    modules={modules}
                    value={text}
                    onChange={handleQuillChange}
                />
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
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
                    className="preview-button"
                    onClick={handleSave}
                    style={{ backgroundColor: '#52c41a' }}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <>
                            <div className="loading-spinner" style={{ width: '16px', height: '16px' }}></div>
                            Saving...
                        </>
                    ) : (
                        'Save Article'
                    )}
                </button>
            </div>

            <div className="ql-editor">
                <div className="preview"></div>
            </div>
        </div>
    );
}