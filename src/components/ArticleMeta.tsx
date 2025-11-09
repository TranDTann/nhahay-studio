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
    return moment(dateString).format('DD/MM/YYYY')
  }

  return (
    <div
      style={{
        padding: '0 16px',
        textAlign: 'center'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', justifyContent: 'center' }}>
          <UserOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
          <Text style={{ fontWeight: 700, color: '#1890ff', fontSize: '18px', letterSpacing: '0.5px', marginLeft: '8px' }}>
            {authorName}
          </Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', justifyContent: 'center' }}>
          <CalendarOutlined style={{ color: '#8c8c8c' }} />
          <Text type="secondary" style={{ marginLeft: '8px' }}>{formatDate(publishAt || createdAt)}</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', justifyContent: 'center' }}>
          <Text type="secondary" style={{ marginRight: '8px' }}>Điểm đánh giá:</Text>
          <Rate
            disabled
            value={ratingAvg}
            allowHalf
            style={{ fontSize: '14px' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', justifyContent: 'center' }}>
          <FolderOutlined style={{ color: '#8c8c8c' }} />
          <Tag color="blue" style={{ marginLeft: '8px' }}>{categoryName}</Tag>
        </div>

        {tags.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', justifyContent: 'center' }}>
            <TagOutlined style={{ color: '#8c8c8c' }} />
            <Space wrap style={{ marginLeft: '8px' }}>
              {tags.map((tag, index) => (
                <Tag key={index} color="green">
                  {tag} <span></span>
                </Tag>
              ))}
            </Space>
          </div>
        )}
      </div>
    </div>
  )
}
