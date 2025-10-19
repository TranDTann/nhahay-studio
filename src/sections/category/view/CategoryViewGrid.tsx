'use client'

import paths from '@/routes/paths'
import { Article } from '@/store/article/crud'
import { formatDateDisplay } from '@/utils/formatDate'
import { Col, Row } from 'antd'
import parse from 'html-react-parser'
import { useRouter } from 'next/navigation'
import './category-post-grid.css'

type TCategoryViewGridProps = {
  categoryPosts: Article[]
}

const CategoryViewGrid = ({ categoryPosts }: TCategoryViewGridProps) => {
  const router = useRouter()

  const navigateToPostDetail = (postItem: Article) => {
    router.push(
      paths.dashboard.postDetail({ id: postItem.id, title: postItem.title })
    )
  }

  return (
    <Row gutter={[24, 24]} id="CategoryViewGrid">
      {categoryPosts.map((postItem) => (
        <Col
          key={postItem.id}
          xs={24}
          sm={12}
          lg={8}
          style={{ padding: '16px' }}
        >
          <div className="category-post-container_grid">
            <img
              src={postItem.image}
              alt="category-post-image"
              className="category-post-image_grid"
              onClick={() => navigateToPostDetail(postItem)}
            />
            <div className="category-post-info_grid">
              <h3
                className="category-post-title_grid display-max-3-lines"
                onClick={() => navigateToPostDetail(postItem)}
              >
                {postItem.title}
              </h3>
              <div className="category-post-content_grid display-max-3-lines">
                {parse(postItem.description ?? '')}
              </div>
              <div>
                <p className="category-post-author_grid">
                  {postItem?.authorName ?? postItem.createdByUser.username}
                </p>
                <div>
                  <span className="category-post-publish-time_grid">
                    {formatDateDisplay(postItem.publishAt)}
                  </span>
                  {' | '}
                  <span className="category-post-read-mins_grid">
                    {postItem.readingTimeMinutes} phút đọc
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  )
}
export default CategoryViewGrid
