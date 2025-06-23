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
                                />
                            );

                        case 'image':
                            return (
                                <div key={block.id} className="content-image" style={{ margin: '24px 0' }}>
                                    <img
                                        src={block.imageUrl}
                                        alt={block.caption || 'Article image'}
                                        style={{
                                            maxWidth: '100%',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
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
                                    <ImgComparisonSlider>
                                        <img slot="first" src={block.leftImageUrl!} alt={block.leftLabel || 'Left image'} />
                                        <img slot="second" src={block.rightImageUrl!} alt={block.rightLabel || 'Right image'} />
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
                                    />
                                );

                            case 'image':
                                return (
                                    <div key={block.id} className="content-image" style={{ margin: '24px 0' }}>
                                        <img
                                            src={block.imageUrl}
                                            alt={block.caption || 'Article image'}
                                            style={{
                                                maxWidth: '100%',
                                                borderRadius: '8px',
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
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
                                        <ImgComparisonSlider>
                                            <img slot="first" src={block.leftImageUrl!} alt={block.leftLabel || 'Left image'} />
                                            <img slot="second" src={block.rightImageUrl!} alt={block.rightLabel || 'Right image'} />
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