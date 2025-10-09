import { Table, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined, SortAscendingOutlined, SortDescendingOutlined, PlayCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Video } from '@/store/video/crud';
import { useEffect, useState } from 'react';
import '@/assets/style/VideoTable.scss';

interface VideoTableProps {
    videos: Video[];
    loading: boolean;
    onEdit: (record: Video) => void;
    onDelete: (record: Video) => void;
    onSort: (field: string) => void;
    sortField: string;
    SortDir: number;
    total?: number;
    currentPage?: number;
    pageSize?: number;
    onPageChange?: (page: number, pageSize: number) => void;
}

export default function VideoTable({
    videos,
    loading,
    onEdit,
    onDelete,
    onSort,
    sortField,
    SortDir,
    total = 0,
    currentPage = 1,
    pageSize = 10,
    onPageChange
}: VideoTableProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const getVideoThumbnail = (link: string) => {
        // Extract video ID from YouTube URL
        const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
        const match = link.match(youtubeRegex);
        if (match) {
            return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
        }
        return null;
    };

    const columns: ColumnsType<Video> = [
        {
            title: (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Title</span>
                    <Button
                        type="text"
                        size="small"
                        className={`sort-button ${sortField === 'title' ? 'active' : ''} ${sortField === 'title' && SortDir === 1 ? 'asc' : sortField === 'title' && SortDir === -1 ? 'desc' : ''}`}
                        icon={sortField === 'title' ? (SortDir === 1 ? <SortDescendingOutlined /> : <SortAscendingOutlined />) : <SortAscendingOutlined />}
                        onClick={() => onSort('title')}
                        style={{ marginLeft: 8 }}
                    />
                </div>
            ),
            dataIndex: 'title',
            key: 'title',
            className: sortField === 'title' ? 'sorted-column' : '',
        },
        {
            title: 'Position',
            dataIndex: 'videoPositionPage',
            key: 'videoPositionPage',
            render: (videoPositionPage) => videoPositionPage || '-',
        },
        {
            title: 'Video',
            dataIndex: 'contentListVideo',
            key: 'contentListVideo',
            render: (contentListVideo) => {
                const thumbnail = getVideoThumbnail(contentListVideo);
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {thumbnail ? (
                            <img
                                src={thumbnail}
                                alt="Video thumbnail"
                                className="video-thumbnail"
                            />
                        ) : (
                            <PlayCircleOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                        )}
                        <a href={contentListVideo} target="_blank" rel="noopener noreferrer" className="video-link" style={{ fontSize: '12px' }}>
                            {contentListVideo.length > 30 ? `${contentListVideo.substring(0, 30)}...` : contentListVideo}
                        </a>
                    </div>
                );
            },
        },
        {
            title: (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Created Date</span>
                    <Button
                        type="text"
                        size="small"
                        className={`sort-button ${sortField === 'createdAt' ? 'active' : ''} ${sortField === 'createdAt' && SortDir === 1 ? 'asc' : sortField === 'createdAt' && SortDir === -1 ? 'desc' : ''}`}
                        icon={sortField === 'createdAt' ? (SortDir === 1 ? <SortDescendingOutlined /> : <SortAscendingOutlined />) : <SortAscendingOutlined />}
                        onClick={() => onSort('createdAt')}
                        style={{ marginLeft: 8 }}
                    />
                </div>
            ),
            dataIndex: 'createdAt',
            key: 'createdAt',
            className: sortField === 'createdAt' ? 'sorted-column' : '',
            render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                    >
                        {!isMobile && 'Edit'}
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => onDelete(record)}
                    >
                        {!isMobile && 'Delete'}
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="video-table" style={{
            overflowX: 'auto',
            width: '100%',
            borderRadius: '8px',
            border: '1px solid #f0f0f0'
        }}>
            <Table
                columns={columns}
                dataSource={videos}
                rowKey="id"
                loading={loading}
                scroll={{ x: 'max-content' }}
                pagination={{
                    current: currentPage,
                    pageSize: 10,
                    total: total,
                    showSizeChanger: false,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
                    onChange: onPageChange,
                }}
            />
        </div>
    );
}
