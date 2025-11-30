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
        textAlign: 'center',

      }}
    >
      <div style={{
        textAlign: 'center', marginBottom: '16px',
        background: 'linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e8e8e8',
        width: 'fit-content',
        margin: '16px auto',
        color: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', justifyContent: 'center' }}>
          <UserOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
          <Text style={{ fontWeight: 700, color: '#fff', fontSize: '18px', letterSpacing: '0.5px', marginLeft: '8px' }}>
            {authorName}
          </Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', justifyContent: 'center' }}>
          <CalendarOutlined />
          <Text type="secondary" style={{ marginLeft: '8px', color: '#fff' }}>{formatDate(publishAt || createdAt)}</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', justifyContent: 'center' }}>
          <Text type="secondary" style={{ marginRight: '8px', color: '#fff' }}>Điểm đánh giá:</Text>
          <Rate
            disabled
            value={ratingAvg}
            allowHalf
            style={{ fontSize: '14px', color: '#fff' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', justifyContent: 'center' }}>
          <FolderOutlined style={{ color: '#fff' }} />
          <Tag color="blue" style={{ marginLeft: '8px' }}>{categoryName}</Tag>
        </div>

        {tags.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', justifyContent: 'center' }}>
            <TagOutlined style={{ color: '#fff' }} />
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
