'use client';

import { useState, useEffect } from 'react';
import { Input, Button, Space, Modal, Spin, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useVideoStore } from '@/store/video/videoStore';
import { Video } from '@/store/video/crud';
import VideoTable from './components/VideoTable';
import VideoForm from './components/VideoForm';

export default function VideosList() {
    const {
        videos,
        loading,
        listLoading,
        error,
        total,
        currentPage,
        pageSize,
        getVideos,
        setFilters,
        setPage,
        createVideo,
        updateVideo,
        deleteVideo
    } = useVideoStore();

    const [searchText, setSearchText] = useState('');
    const [pendingSearch, setPendingSearch] = useState('');
    const [sortField, setSortField] = useState<string>('');
    const [SortDir, setSortDirection] = useState<number>(0);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getVideos();
            } catch (error) {
                // Error is already handled in the store
            }
        };
        fetchData();
    }, [getVideos]);

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPendingSearch(e.target.value);
    };

    const handleSearch = () => {
        setSearchText(pendingSearch);
        const filters = {
            search: pendingSearch,
            sort: sortField,
            SortDir: SortDir
        };
        setFilters(filters, true);
    };

    const handleSearchIconClick = () => {
        handleSearch();
    };

    const handleSort = (field: string) => {
        const newSortDirection = field === sortField ? (SortDir === 0 ? 1 : 0) : 0;
        setSortField(field);
        setSortDirection(newSortDirection);

        const filters = {
            search: searchText,
            sort: field,
            SortDir: newSortDirection
        };
        setFilters(filters);
    };

    const handleEdit = (record: Video) => {
        setSelectedVideo(record);
        setEditModalVisible(true);
    };

    const handleDelete = (record: Video) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this video?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                try {
                    await deleteVideo(record.id!);
                } catch (error) {
                    // Error is already handled in the store
                }
            },
        });
    };

    const handleFormSubmit = async (data: Video) => {
        setFormLoading(true);
        try {
            if (selectedVideo) {
                await updateVideo({ ...data, id: selectedVideo.id });
            } else {
                await createVideo(data);
            }
            setEditModalVisible(false);
            setSelectedVideo(null);
        } catch (error) {
            // Error is already handled in the store
        } finally {
            setFormLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    if (loading && videos.length === 0) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="videos-container" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ marginBottom: '24px' }}>Video Management</h1>

                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Row gutter={[16, 16]}>
                        <Col lg={16} md={16} span={24}>
                            <Input
                                placeholder="Search videos"
                                prefix={<SearchOutlined style={{ cursor: 'pointer' }} onClick={handleSearchIconClick} />}
                                value={pendingSearch}
                                onChange={handleSearchInput}
                                style={{ width: '100%' }}
                                onPressEnter={handleSearch}
                            />
                        </Col>
                        <Col lg={8} md={8} span={24}>
                            <Button type="primary" onClick={() => {
                                setSelectedVideo(null);
                                setEditModalVisible(true);
                            }}>
                                Add Video
                            </Button>
                        </Col>
                    </Row>
                </Space>
            </div>

            <VideoTable
                videos={videos}
                loading={listLoading || loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSort={handleSort}
                sortField={sortField}
                SortDir={SortDir}
                total={total}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
            />

            {editModalVisible && (
                <VideoForm
                    visible={editModalVisible}
                    onCancel={() => {
                        setEditModalVisible(false);
                        setSelectedVideo(null);
                    }}
                    onSubmit={handleFormSubmit}
                    initialValues={selectedVideo}
                    title={selectedVideo ? "Edit Video" : "Add Video"}
                    loading={formLoading}
                />
            )}
        </div>
    );
}
