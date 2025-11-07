'use client'

import { Tag, Space, Typography, Rate } from 'antd'
import {
  CalendarOutlined,
  EditOutlined,
  TagOutlined,
  FolderOutlined,
  StarFilled,
  UserOutlined
} from '@ant-design/icons'
import moment from 'moment'

const { Text } = Typography

interface ArticleMetaProps {
  createdAt: string
  updatedAt: string
  publishAt: string
  categoryName: string
  tags: string[]
  ratingAvg: number
  authorName: string
}

export default function ArticleMeta({
  createdAt,
  updatedAt,
  publishAt,
  categoryName,
  tags,
  ratingAvg,
  authorName
}: ArticleMetaProps) {
  const formatDate = (dateString: string) => {
    return moment(dateString).format('DD/MM/YYYY HH:mm')
  }

  return (
    <div
      style={{
        padding: '0 16px'
      }}
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <Space
            align="center"
            style={{
              padding: '8px 16px',
              display: 'inline-flex'
            }}
          >
            <UserOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
            <Text style={{ fontWeight: 700, color: '#1890ff', fontSize: '18px', letterSpacing: '0.5px' }}>
              {authorName}
            </Text>
          </Space>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '14px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          <Space>
            <CalendarOutlined style={{ color: '#8c8c8c' }} />
            <Text type="secondary">{formatDate(publishAt || createdAt)}</Text>
          </Space>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '14px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          <Space>
            <Text type="secondary">Điểm đánh giá:</Text>
            <Rate
              disabled
              value={ratingAvg}
              allowHalf
              style={{ fontSize: '14px' }}
            />
          </Space>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '14px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          <Space>
            <FolderOutlined style={{ color: '#8c8c8c' }} />
            <Tag color="blue">{categoryName}</Tag>
          </Space>

          {tags.length > 0 && (
            <Space>
              <TagOutlined style={{ color: '#8c8c8c' }} />
              <Space wrap>
                {tags.map((tag, index) => (
                  <Tag key={index} color="green">
                    {tag}
                  </Tag>
                ))}
              </Space>
            </Space>
          )}
        </div>
      </Space>
    </div>
  )
}
