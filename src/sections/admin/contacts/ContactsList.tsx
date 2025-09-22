'use client';

import { useEffect, useState } from 'react';
import { App, Card, Col, Descriptions, Drawer, Input, Pagination, Row, Space, Spin, Tag } from 'antd';
import { contactCrud, TContact } from '@/store/contact/crud';

export default function ContactsList() {
    const { message } = App.useApp();
    const [loading, setLoading] = useState(true);
    const [listLoading, setListLoading] = useState(false);
    const [contacts, setContacts] = useState<TContact[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [selected, setSelected] = useState<TContact | null>(null);
    const [search, setSearch] = useState('');
    const [pendingSearch, setPendingSearch] = useState('');

    useEffect(() => {
        fetchContacts();
        // eslint-disable-next-line
    }, [page, search]);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const res = await contactCrud.getContacts(page, pageSize, search);
            const data = res?.result || [];
            const count = res?.count || 0;
            setContacts(data);
            setTotal(count);
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Failed to fetch contacts');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        setSearch(pendingSearch);
        setPage(1);
        setListLoading(true);
        try {
            const res = await contactCrud.getContacts(1, pageSize, pendingSearch);
            setContacts(res.result || []);
            setTotal(res.count || 0);
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Failed to fetch contacts');
        } finally {
            setListLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 50 }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ marginBottom: 16 }}>Customer Contacts</h1>
                <Space style={{ width: '100%' }} direction="vertical" size="middle">
                    <Input.Search
                        placeholder="Search by name, phone, email..."
                        value={pendingSearch}
                        onChange={(e) => setPendingSearch(e.target.value)}
                        onSearch={handleSearch}
                        enterButton
                    />
                </Space>
            </div>

            <Spin spinning={listLoading}>
                {contacts.length > 0 ? (
                    <>
                        <Row gutter={[16, 16]}>
                            {contacts.map(item => (
                                <Col xs={24} sm={12} md={8} xxl={6} key={item.id}>
                                    <Card
                                        hoverable
                                        onClick={() => setSelected(item)}
                                        title={
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.userName}</span>
                                                <Tag>{item.phone}</Tag>
                                            </div>
                                        }
                                    >
                                        <div style={{ color: '#555' }}>
                                            <div style={{ marginBottom: 6 }}>
                                                <strong>Email:</strong> {item.email || '-'}
                                            </div>
                                            <div style={{ marginBottom: 6 }}>
                                                <strong>Address:</strong> {item.address || '-'}
                                            </div>
                                            <div style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical'
                                            }}>
                                                <strong>Note:</strong> {item.note || '-'}
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        <div style={{ marginTop: 24, textAlign: 'center' }}>
                            <Pagination
                                current={page}
                                pageSize={pageSize}
                                total={total}
                                onChange={(p) => setPage(p)}
                                showSizeChanger={false}
                            />
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', color: '#666', padding: '40px 0' }}>
                        No contacts found.
                    </div>
                )}
            </Spin>

            <Drawer
                title="Contact Details"
                open={!!selected}
                onClose={() => setSelected(null)}
                width={520}
            >
                {selected && (
                    <Descriptions column={1} bordered size="small">
                        <Descriptions.Item label="Full Name">{selected.userName}</Descriptions.Item>
                        <Descriptions.Item label="Phone">{selected.phone}</Descriptions.Item>
                        <Descriptions.Item label="Email">{selected.email}</Descriptions.Item>
                        <Descriptions.Item label="Address">{selected.address}</Descriptions.Item>
                        <Descriptions.Item label="Note">{selected.note}</Descriptions.Item>
                    </Descriptions>
                )}
            </Drawer>
        </div>
    );
}


