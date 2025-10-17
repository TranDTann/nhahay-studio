'use client';

import { useEffect, useState } from 'react';
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

    const YouTubeLazy = ({ youtubeId, title }: { youtubeId?: string, title?: string }) => {
        const [isPlaying, setIsPlaying] = useState(false);
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
                        title={title}
                    >
                        <img
                            src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
                            alt={title || 'YouTube thumbnail'}
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
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                        title={title || 'YouTube video player'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{ border: 0, borderRadius: 8 }}
                    />
                )}
            </div>
        );
    };

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
                                            alt={block.imageAlt || block.caption || 'Article image'}
                                            title={block.imageTitle}
                                            style={{
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
                                                alt={block.leftAlt || block.leftLabel || 'Left image'}
                                                style={{
                                                    width: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <img
                                                slot="second"
                                                src={block.rightImageUrl!}
                                                alt={block.rightAlt || block.rightLabel || 'Right image'}
                                                style={{
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

                        case 'youtube':
                            return (
                                <div key={block.id}>
                                    <YouTubeLazy youtubeId={block.youtubeId} title={block.youtubeTitle} />
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
                                                alt={block.imageAlt || block.caption || 'Article image'}
                                                title={block.imageTitle}
                                                style={{
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
                                                    alt={block.leftAlt || block.leftLabel || 'Left image'}
                                                    style={{
                                                        width: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                <img
                                                    slot="second"
                                                    src={block.rightImageUrl!}
                                                    alt={block.rightAlt || block.rightLabel || 'Right image'}
                                                    style={{
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

                            case 'youtube':
                                return (
                                    <div key={block.id}>
                                        <YouTubeLazy youtubeId={block.youtubeId} title={block.youtubeTitle} />
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