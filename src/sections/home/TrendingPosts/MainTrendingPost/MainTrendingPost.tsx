'use client'

import paths from '@/routes/paths'
import { Article } from '@/store/article/crud'
import { Col, Row } from 'antd'
import parse from 'html-react-parser'
import { useRouter } from 'next/navigation'
import CategoryTag from '../../components/CategoryTag/CategoryTag'
import PostMeta from '../../components/PostMeta/PostMeta'
import './styles.css'

type TMainTrendingPostProps = {
  postData: Article
}

const MainTrendingPost = ({ postData }: TMainTrendingPostProps) => {
  const router = useRouter()

  const navigateToPostDetail = () => {
    router.push(
      paths.dashboard.postDetail({ id: postData.id, title: postData.title })
    )
  }

  return (
    <div className="trending-post-container">
      <Row gutter={24}>
        <Col span={12}>
          <div
            className="trending-post-image-container image-hover-zoom-container"
            onClick={navigateToPostDetail}
          >
            <img
              src={postData.image}
              alt="MainTrendingPost-image"
              className="trending-post-image image-hover-zoom"
            />
          </div>
        </Col>
        <Col span={12}>
          <div className="trending-post-content">
            <CategoryTag tagName={postData.category?.name} />
            <h3
              className="trending-post-title display-max-3-lines"
              onClick={navigateToPostDetail}
            >
              {postData.title}
            </h3>
            <PostMeta
              author={postData.createdByUser.username}
              readingTimeMinutes={postData.readingTimeMinutes}
              publishTime={postData.publishAt}
            />
            <div className="trending-post-description">
              {parse(postData.description ?? '')}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default MainTrendingPost
