export const styleArticle = `
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
        `
