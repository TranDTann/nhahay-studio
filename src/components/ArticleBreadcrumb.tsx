'use client'

import paths from '@/routes/paths'
import { EditOutlined, FileTextOutlined, HomeOutlined } from '@ant-design/icons'
import { Breadcrumb, Button } from 'antd'
import { useRouter } from 'next/navigation'

interface ArticleBreadcrumbProps {
  articleTitle: string
  articleId: string
}

export default function ArticleBreadcrumb({
  articleTitle,
  articleId
}: ArticleBreadcrumbProps) {
  const router = useRouter()

  const breadcrumbItems = [
    {
      title: (
        <Button
          type="text"
          icon={<HomeOutlined />}
          onClick={() => router.push(paths.admin.root())}
        >
          Admin
        </Button>
      )
    },
    {
      title: (
        <Button
          type="text"
          icon={<FileTextOutlined />}
          onClick={() => router.push(paths.admin.articles())}
        >
          Articles
        </Button>
      )
    },
    {
      title: (
        <span style={{ color: '#1890ff', fontWeight: 500 }}>
          {articleTitle}
        </span>
      )
    }
  ]

  return (
    <div
      style={{
        padding: '16px 0',
        borderBottom: '1px solid #f0f0f0',
        marginBottom: '24px'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <Breadcrumb items={breadcrumbItems} />
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => router.push(paths.admin.article(articleId))}
        >
          Edit Article
        </Button>
      </div>
    </div>
  )
}
