'use client';

import { useEffect, useState } from 'react';
import { Card, Typography, Space, Collapse } from 'antd';
import { LinkOutlined, DownOutlined } from '@ant-design/icons';
import styles from './TableOfContents.module.scss';

const { Text } = Typography;

interface TableOfContentsProps {
    className?: string;
    renderOnly?: boolean; // If true, only render the items without wrapper
}

interface TocItem {
    id: string;
    text: string;
    level: number;
}

export default function TableOfContents({ className = '', renderOnly = false }: TableOfContentsProps) {
    const [tocItems, setTocItems] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        // Function to extract headings
        const extractHeadings = () => {
            // Try multiple selectors to find headings
            const headings = document.querySelectorAll('.article-renderer h2, .articleContent h2');
            const items: TocItem[] = Array.from(headings).map((heading, index) => {
                // Use existing id or create a new one
                let id = heading.id;
                if (!id) {
                    id = `heading-${Date.now()}-${index}`;
                    heading.id = id;
                }
                return {
                    id,
                    text: heading.textContent || '',
                    level: 2
                };
            });
            console.log('Table of Contents items:', items);
            setTocItems(items);
        };

        // Wait for content to be rendered - try multiple times
        const timer1 = setTimeout(extractHeadings, 500);
        const timer2 = setTimeout(extractHeadings, 1000);
        const timer3 = setTimeout(extractHeadings, 2000);

        // Also listen for DOM changes
        const observer = new MutationObserver(() => {
            extractHeadings();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        // Set up intersection observer for active heading detection
        const timer = setTimeout(() => {
            const headings = document.querySelectorAll('h2');
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveId(entry.target.id);
                        }
                    });
                },
                {
                    rootMargin: '-20% 0px -80% 0px',
                    threshold: 0
                }
            );

            headings.forEach((heading) => observer.observe(heading));

            return () => {
                headings.forEach((heading) => observer.unobserve(heading));
            };
        }, 600);

        return () => clearTimeout(timer);
    }, []);

    const scrollToHeading = (id: string) => {
        console.log('Attempting to scroll to:', id);

        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
            const element = document.getElementById(id);
            console.log('Found element:', element);
            setActiveId(id);
            if (element) {
                // Get the element's position relative to the document
                const rect = element.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const elementTop = rect.top + scrollTop;
                const offset = 100; // Adjust this value based on your header height

                // Try multiple scroll methods
                try {
                    // Method 1: Direct scrollTo
                    window.scrollTo({
                        top: elementTop - offset,
                        behavior: 'smooth'
                    });
                } catch (error) {
                    console.log('Method 1 failed, trying Method 2');
                    try {
                        // Method 2: Using documentElement
                        document.documentElement.scrollTop = elementTop - offset;
                    } catch (error2) {
                        console.log('Method 2 failed, trying Method 3');
                        // Method 3: Using body
                        document.body.scrollTop = elementTop - offset;
                    }
                }
            } else {
                console.warn(`Element with id "${id}" not found`);
                // Try to find all h2 elements for debugging
                const allH2s = document.querySelectorAll('h2');
                console.log('All h2 elements found:', Array.from(allH2s).map(h => ({ id: h.id, text: h.textContent })));
            }
        }, 200);
    };

    const renderTocItems = () => {
        if (tocItems.length === 0) {
            return (
                <div style={{ padding: '8px 0', color: '#999', fontSize: '14px' }}>
                    Chưa có mục lục
                </div>
            );
        }

        return (
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                {tocItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => scrollToHeading(item.id)}
                        style={{
                            cursor: 'pointer',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            backgroundColor: activeId === item.id ? '#f0f0f0' : 'transparent',
                            borderLeft: activeId === item.id ? '3px solid #1890ff' : '3px solid transparent',
                            transition: 'all 0.2s ease',
                            fontSize: '14px',
                            lineHeight: '1.4'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f5f5f5';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = activeId === item.id ? '#f0f0f0' : 'transparent';
                        }}
                    >
                        <Text
                            style={{
                                color: activeId === item.id ? '#1890ff' : '#333',
                                fontWeight: activeId === item.id ? '500' : 'normal'
                            }}
                        >
                            {item.text}
                        </Text>
                    </div>
                ))}
            </Space>
        );
    };

    // If renderOnly, just return the items
    if (renderOnly) {
        return <>{renderTocItems()}</>;
    }

    // If no items and not renderOnly, return null
    if (tocItems.length === 0) {
        return null;
    }

    return (
        <div className={`table-of-contents-wrapper ${styles.tableOfContentsWrapper} ${className}`}>
            {/* Desktop version - Card */}
            <div className={styles.desktopTocCard}>
                <Card
                    title={
                        <Space>
                            <LinkOutlined />
                            <Text strong>Mục lục</Text>
                        </Space>
                    }
                    className={`table-of-contents ${styles.tableOfContents}`}
                >
                    {renderTocItems()}
                </Card>
            </div>

            {/* Mobile version - Collapse */}
            <div className={styles.mobileTocCollapse}>
                <Collapse
                    ghost
                    expandIcon={({ isActive }) => (
                        <DownOutlined rotate={isActive ? 180 : 0} />
                    )}
                    style={{
                        background: 'white',
                        border: '1px solid #f0f0f0',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
                    }}
                >
                    <Collapse.Panel
                        header={
                            <Space>
                                <LinkOutlined />
                                <Text strong>Mục lục</Text>
                            </Space>
                        }
                        key="1"
                    >
                        {renderTocItems()}
                    </Collapse.Panel>
                </Collapse>
            </div>
        </div>
    );
}