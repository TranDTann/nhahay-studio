'use client'
import React, { useState } from 'react';
import { Table, Button, Space, Card, Typography, Input, Select } from 'antd';
import { EditOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ConfigItem, ConfigQueryParams } from '@/api/configService';
import { useConfig } from '@/hooks/useConfig';
import ConfigFormModal from '@/components/admin/ConfigFormModal';
import '@/assets/style/ConfigPage.scss';

const { Title } = Typography;

const ConfigPage: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [editingConfig, setEditingConfig] = useState<ConfigItem | null>(null);
    const [searchText, setSearchText] = useState('');
    const [sortField, setSortField] = useState<string>('key');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const { configs, loading, pagination, fetchConfigs, createConfig, updateConfig, deleteConfig } = useConfig();
    // Handle form submission
    const handleSubmit = async (values: ConfigItem) => {
        const success = editingConfig?.id
            ? await updateConfig({
                ...values,
                id: editingConfig.id
            })
            : await createConfig(values);

        if (success) {
            setModalVisible(false);
            setEditingConfig(null);
        }
    };

    // Handle edit
    const handleEdit = (record: ConfigItem) => {
        setEditingConfig(record);
        setModalVisible(true);
    };

    // Handle delete
    const handleDelete = async (id: number) => {
        await deleteConfig(id);
    };

    // Handle add new
    const handleAdd = () => {
        setEditingConfig(null);
        setModalVisible(true);
    };

    // Handle modal cancel
    const handleModalCancel = () => {
        setModalVisible(false);
        setEditingConfig(null);
    };

    // Handle search
    const handleSearch = (value: string) => {
        setSearchText(value);
        const params: ConfigQueryParams = {
            search: value,
            sort: sortField,
            sortDir: sortDirection === 'asc' ? 0 : 1,
            skip: 0,
            take: pagination.pageSize
        };
        fetchConfigs(params);
    };

    // Handle sort change
    const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
        setSortField(field);
        setSortDirection(direction);
        const params: ConfigQueryParams = {
            search: searchText,
            sort: field,
            sortDir: direction === 'asc' ? 0 : 1,
            skip: 0,
            take: pagination.pageSize
        };
        fetchConfigs(params);
    };

    // Handle pagination change
    const handlePaginationChange = (page: number, pageSize: number) => {
        const params: ConfigQueryParams = {
            search: searchText,
            sort: sortField,
            sortDir: sortDirection === 'asc' ? 0 : 1,
            skip: (page - 1) * pageSize,
            take: pageSize
        };
        fetchConfigs(params);
    };

    // Handle refresh
    const handleRefresh = () => {
        const params: ConfigQueryParams = {
            search: searchText,
            sort: sortField,
            sortDir: sortDirection === 'asc' ? 0 : 1,
            skip: 0,
            take: pagination.pageSize
        };
        fetchConfigs(params);
    };



    // Table columns
    const columns = [
        {
            title: 'Key',
            dataIndex: 'key',
            key: 'key',
            width: '25%',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            width: '35%',
            render: (value: string) => (
                <div style={{ wordBreak: 'break-word' }}>
                    {value.length > 100 ? `${value.substring(0, 100)}...` : value}
                </div>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '25%',
            render: (description: string) => (
                <div style={{ wordBreak: 'break-word' }}>
                    {description.length > 50 ? `${description.substring(0, 50)}...` : description}
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '15%',
            render: (_: any, record: ConfigItem) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        size="small"
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="config-page" style={{ padding: '24px' }}>
            <Card>
                <div className="config-header">
                    <Title level={2} className="config-title">Config Management</Title>
                    <div className="config-actions">
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={handleRefresh}
                            loading={loading}
                        >
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Search and Sort Controls */}
                <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <Input.Search
                        placeholder="Search configs..."
                        allowClear
                        style={{ width: 300 }}
                        onSearch={handleSearch}
                        prefix={<SearchOutlined />}
                    />
                    <Select
                        value={sortField}
                        style={{ width: 120 }}
                        onChange={(value) => handleSortChange(value, sortDirection)}
                    >
                        <Select.Option value="key">Key</Select.Option>
                        <Select.Option value="value">Value</Select.Option>
                        <Select.Option value="description">Description</Select.Option>
                        <Select.Option value="createdAt">Created At</Select.Option>
                        <Select.Option value="updatedAt">Updated At</Select.Option>
                    </Select>
                    <Select
                        value={sortDirection}
                        style={{ width: 100 }}
                        onChange={(value) => handleSortChange(sortField, value)}
                    >
                        <Select.Option value="asc">Asc</Select.Option>
                        <Select.Option value="desc">Desc</Select.Option>
                    </Select>
                </div>

                <div className="config-table">
                    <Table
                        columns={columns}
                        dataSource={configs}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: pagination.total,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                            onChange: handlePaginationChange,
                            onShowSizeChange: handlePaginationChange,
                        }}
                    />
                </div>

                {modalVisible && (
                    <ConfigFormModal
                        visible={modalVisible}
                        editingConfig={editingConfig}
                        onCancel={handleModalCancel}
                        onSubmit={handleSubmit}
                        loading={loading}
                    />
                )}
            </Card>
        </div>
    );
};

export default ConfigPage; 