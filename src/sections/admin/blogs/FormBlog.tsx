'use client';

import hljs from 'highlight.js/lib/core';
import css from 'highlight.js/lib/languages/css';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';

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

interface BlogPost {
    title: string;
    description: string;
    content: string;
    coverImage: File | null;
    coverImagePreview: string;
}

interface QuillModules {
    toolbar: Array<any>;
    imageResize?: any;
}

export default function FormBlog() {
    const [isLoading, setIsLoading] = useState(true);
    const [text, setText] = useState('hello world');
    const [textInput, setTextInput] = useState('');
    const [quillInstance, setQuillInstance] = useState<any>(null);
    const [editorHtml, setEditorHtml] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [blogPost, setBlogPost] = useState<BlogPost>({
        title: '',
        description: '',
        content: '',
        coverImage: null,
        coverImagePreview: ''
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
        style.innerHTML = `
            .preview {
                padding: 20px;
                background: #fff;
                min-height: 200px;
                margin-top: 20px;
                border: 1px solid #ccc;
            }
            .preview p[data-align="center"] {
                text-align: center;
            }
            .preview p[data-align="right"] {
                text-align: right;
            }
            .preview p[data-align="justify"] {
                text-align: justify;
            }
            .preview img {
                max-width: 100%;
                height: auto;
            }
            .preview blockquote {
                border-left: 4px solid #ccc;
                margin: 0;
                padding-left: 16px;
            }
            .preview pre {
                background: #f4f4f4;
                padding: 10px;
                border-radius: 4px;
            }
            .preview-button-container {
                margin: 20px 0;
                display: flex;
                justify-content: flex-end;
            }
            .preview-button {
                background-color: #06c;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
                transition: background-color 0.2s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .preview-button:hover {
                background-color: #004c99;
            }
            .preview-button:active {
                background-color: #003366;
            }
            .preview-button:focus {
                outline: none;
                box-shadow: 0 0 0 2px rgba(0,102,204,0.3);
            }
            .blog-form {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }
            .form-group {
                margin-bottom: 20px;
            }
            .form-label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: #333;
            }
            .form-input {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 16px;
                transition: border-color 0.2s ease;
            }
            .form-input:focus {
                outline: none;
                border-color: #06c;
                box-shadow: 0 0 0 2px rgba(0,102,204,0.1);
            }
            .form-textarea {
                min-height: 100px;
                resize: vertical;
            }
            .image-upload {
                display: flex;
                align-items: center;
                gap: 20px;
            }
            .image-preview {
                width: 200px;
                height: 120px;
                border-radius: 4px;
                border: 1px solid #ccc;
                object-fit: cover;
                display: none;
            }
            .image-preview.has-image {
                display: block;
            }
            .upload-button {
                padding: 8px 16px;
                background-color: #f4f4f4;
                border: 1px solid #ccc;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .upload-button:hover {
                background-color: #e7e7e7;
            }
            .upload-button svg {
                width: 20px;
                height: 20px;
            }
            .loading-container {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #06c;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .loading-text {
                margin-top: 16px;
                color: #333;
                font-size: 16px;
                text-align: center;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const handleQuillChange = (content: string, delta: any, source: any, editor: any) => {
        setText(content);
        setQuillInstance(editor);
        setEditorHtml(editor.getHTML());
        setBlogPost(prev => ({ ...prev, content: content }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBlogPost(prev => ({
                    ...prev,
                    coverImage: file,
                    coverImagePreview: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
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
        <div className="blog-form">
            <div className="form-group">
                <label className="form-label" htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    className="form-input"
                    value={blogPost.title}
                    onChange={(e) => setBlogPost(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter blog title"
                />
            </div>

            <div className="form-group">
                <label className="form-label">Cover Image</label>
                <div className="image-upload">
                    <img
                        src={blogPost.coverImagePreview || '/placeholder-image.jpg'}
                        alt="Cover preview"
                        className={`image-preview ${blogPost.coverImagePreview ? 'has-image' : ''}`}
                    />
                    <label className="upload-button" htmlFor="cover-image">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 5V19M5 12H19" stroke="#666" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Upload Cover Image
                    </label>
                    <input
                        id="cover-image"
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="description">Description</label>
                <textarea
                    id="description"
                    className="form-input form-textarea"
                    value={blogPost.description}
                    onChange={(e) => setBlogPost(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter blog description"
                />
            </div>

            <div className="form-group">
                <label className="form-label">Content</label>
                <ReactQuill
                    theme="snow"
                    modules={modules as unknown as Record<string, unknown>}
                    value={text}
                    onChange={handleQuillChange}
                />
            </div>

            <div className="preview-button-container">
                <button className="preview-button" onClick={previewHtml}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor" />
                    </svg>
                    Preview
                </button>
            </div>
            <div className="ql-editor">
                <div className="preview"></div>
            </div>
        </div>
    );
}