'use client';

import { useEffect } from 'react';
import hljs from 'highlight.js/lib/core';
import css from 'highlight.js/lib/languages/css';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/github.css';
import { convertContentStringToBlocks, ContentBlock } from '@/utils/contentBlocksUtils';
import { ImgComparisonSlider } from '@img-comparison-slider/react';

// Register highlight.js languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('java', java);

interface ArticleRendererProps {
    content: string;
    className?: string;
    contentBlocks?: ContentBlock[];
}

export default function ArticleRenderer({ content, className = '', contentBlocks }: ArticleRendererProps) {
    useEffect(() => {
        // Apply syntax highlighting to code blocks
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach((block) => {
            hljs.highlightBlock(block as HTMLElement);
        });

        // Apply custom styling to paragraphs with alignment
        const paragraphs = document.querySelectorAll('p');
        paragraphs.forEach((p) => {
            const style = p.getAttribute('style') || '';
            if (style.includes('text-align: center')) {
                p.setAttribute('data-align', 'center');
            } else if (style.includes('text-align: right')) {
                p.setAttribute('data-align', 'right');
            } else if (style.includes('text-align: justify')) {
                p.setAttribute('data-align', 'justify');
            }
        });

        // Add IDs to h2 elements for table of contents
        setTimeout(() => {
            const h2Elements = document.querySelectorAll('h2');
            h2Elements.forEach((h2, index) => {
                if (!h2.id) {
                    // Create a more stable ID based on content
                    const text = h2.textContent || '';
                    const sanitizedText = text
                        .toLowerCase()
                        .replace(/[^a-z0-9\s]/g, '')
                        .replace(/\s+/g, '-')
                        .substring(0, 30);
                    h2.id = `heading-${sanitizedText}-${index}`;
                }
            });
        }, 100);
    }, [content, contentBlocks]);

    // If contentBlocks are provided, render them instead of content
    if (contentBlocks && contentBlocks.length > 0) {
        return (
            <div className={`article-renderer ${className}`}>
                {contentBlocks.map((block) => {
                    switch (block.type) {
                        case 'text':
                            return (
                                <div
                                    key={block.id}
                                    className="content-text"
                                    dangerouslySetInnerHTML={{ __html: block.content }}
                                    style={{
                                        fontSize: '16px',
                                        lineHeight: '1.8',
                                        textAlign: 'justify'
                                    }}
                                    ref={(el) => {
                                        if (el) {
                                            // Add IDs to h2 elements for table of contents
                                            const h2Elements = el.querySelectorAll('h2');
                                            h2Elements.forEach((h2, index) => {
                                                if (!h2.id) {
                                                    // Create a more stable ID based on content
                                                    const text = h2.textContent || '';
                                                    const sanitizedText = text
                                                        .toLowerCase()
                                                        .replace(/[^a-z0-9\s]/g, '')
                                                        .replace(/\s+/g, '-')
                                                        .substring(0, 30);
                                                    h2.id = `heading-${sanitizedText}-${index}`;
                                                }
                                            });
                                        }
                                    }}
                                />
                            );

                        case 'image':
                            return (
                                <div key={block.id} className="content-image" style={{ margin: '24px 0' }}>
                                    <div style={{

                                        margin: '0 auto',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                    }}>
                                        <img
                                            src={block.imageUrl}
                                            alt={block.caption || 'Article image'}
                                            style={{
                                                width: '400px',
                                                height: '600px',
                                                objectFit: 'cover',
                                                borderRadius: '8px'
                                            }}
                                        />
                                    </div>
                                    {block.caption && (
                                        <p className="image-caption" style={{
                                            textAlign: 'center',
                                            color: '#666',
                                            fontSize: '14px',
                                            marginTop: '8px',
                                            fontStyle: 'italic'
                                        }}>
                                            {block.caption}
                                        </p>
                                    )}
                                </div>
                            );

                        case 'compare':
                            return (
                                <div key={block.id} className="content-compare" style={{ margin: '24px 0' }}>
                                    <div style={{
                                        height: '400px',
                                        width: '100%',
                                        margin: '0 auto',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <ImgComparisonSlider style={{ width: '100%', height: '100%' }}>
                                            <img
                                                slot="first"
                                                src={block.leftImageUrl!}
                                                alt={block.leftLabel || 'Left image'}
                                                style={{
                                                    height: '400px',
                                                    width: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <img
                                                slot="second"
                                                src={block.rightImageUrl!}
                                                alt={block.rightLabel || 'Right image'}
                                                style={{
                                                    height: '400px',
                                                    width: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </ImgComparisonSlider>
                                    </div>
                                    {(block.leftLabel || block.rightLabel) && (
                                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 8, gap: '20px' }}>
                                            <span>{block.leftLabel}</span>
                                            <span>{block.rightLabel}</span>
                                        </div>
                                    )}
                                </div>
                            );

                        default:
                            return null;
                    }
                })}
            </div>
        );
    }

    // If no contentBlocks but content exists, try to convert and render
    if (content && content.trim() !== '') {
        const convertedBlocks = convertContentStringToBlocks(content);
        if (convertedBlocks.length > 0) {
            return (
                <div className={`article-renderer ${className}`}>
                    {convertedBlocks.map((block) => {
                        switch (block.type) {
                            case 'text':
                                return (
                                    <div
                                        key={block.id}
                                        className="content-text"
                                        dangerouslySetInnerHTML={{ __html: block.content }}
                                        style={{
                                            fontSize: '16px',
                                            lineHeight: '1.8',
                                            textAlign: 'justify'
                                        }}
                                        ref={(el) => {
                                            if (el) {
                                                // Add IDs to h2 elements for table of contents
                                                const h2Elements = el.querySelectorAll('h2');
                                                h2Elements.forEach((h2, index) => {
                                                    if (!h2.id) {
                                                        // Create a more stable ID based on content
                                                        const text = h2.textContent || '';
                                                        const sanitizedText = text
                                                            .toLowerCase()
                                                            .replace(/[^a-z0-9\s]/g, '')
                                                            .replace(/\s+/g, '-')
                                                            .substring(0, 30);
                                                        h2.id = `heading-${sanitizedText}-${index}`;
                                                    }
                                                });
                                            }
                                        }}
                                    />
                                );

                            case 'image':
                                return (
                                    <div key={block.id} className="content-image" style={{ margin: '24px 0' }}>
                                        <div style={{
                                            height: '400px',
                                            width: 'auto',
                                            margin: '0 auto',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <img
                                                src={block.imageUrl}
                                                alt={block.caption || 'Article image'}
                                                style={{
                                                    height: '400px',
                                                    width: 'auto',
                                                    objectFit: 'contain',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                        </div>
                                        {block.caption && (
                                            <p className="image-caption" style={{
                                                textAlign: 'center',
                                                color: '#666',
                                                fontSize: '14px',
                                                marginTop: '8px',
                                                fontStyle: 'italic'
                                            }}>
                                                {block.caption}
                                            </p>
                                        )}
                                    </div>
                                );

                            case 'compare':
                                return (
                                    <div key={block.id} className="content-compare" style={{ margin: '24px 0' }}>
                                        <div style={{
                                            height: '400px',
                                            width: '100%',
                                            margin: '0 auto',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <ImgComparisonSlider style={{ width: '100%', height: '100%' }}>
                                                <img
                                                    slot="first"
                                                    src={block.leftImageUrl!}
                                                    alt={block.leftLabel || 'Left image'}
                                                    style={{
                                                        height: '400px',
                                                        width: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                <img
                                                    slot="second"
                                                    src={block.rightImageUrl!}
                                                    alt={block.rightLabel || 'Right image'}
                                                    style={{
                                                        height: '400px',
                                                        width: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            </ImgComparisonSlider>
                                        </div>
                                        {(block.leftLabel || block.rightLabel) && (
                                            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 8, gap: '20px' }}>
                                                <span>{block.leftLabel}</span>
                                                <span>{block.rightLabel}</span>
                                            </div>
                                        )}
                                    </div>
                                );

                            default:
                                return null;
                        }
                    })}
                </div>
            );
        }
    }

    // Fallback to original content rendering
    return (
        <div
            className={`article-renderer ${className}`}
            dangerouslySetInnerHTML={{ __html: content }}
            style={{
                fontSize: '16px',
                lineHeight: '1.8',
                textAlign: 'justify'
            }}
        />
    );
} 