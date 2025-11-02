import paths from '@/routes/paths'
import { Article } from '@/store/article/crud'
import { Col, Row } from 'antd'
import parse from 'html-react-parser'
import { useRouter } from 'next/navigation'
import PostMeta from '../../components/PostMeta/PostMeta'
import './styles.scss'

type TRecentPostItemProps = {
  post: Article
}

const RecentPostItem = ({ post }: TRecentPostItemProps) => {
  const router = useRouter()

  const navigateToPostDetail = () => {
    router.push(paths.dashboard.postDetail({ id: post.id, title: post.title }))
  }
  return (
    <div id="RecentPostItem">
      <Row gutter={24} className="recent-post-item-container">
        <Col span={8}>
          <div
            className="recent-post-item-image-container image-hover-zoom-container"
            onClick={navigateToPostDetail}
          >
            <img
              src={post.image}
              alt="recent-post-image"
              className="recent-post-item-image image-hover-zoom"
            />
          </div>
        </Col>
        <Col span={16} className="recent-post-item-info">
          <h2
            className="display-max-2-lines recent-post-item-title"
            onClick={navigateToPostDetail}
          >
            {post.title}
          </h2>
          <PostMeta
            author={post?.authorName ?? post?.createdByUser?.username}
          />
          <p className="display-max-3-lines center-post-description">
            {parse(post.description ?? '')}
          </p>
        </Col>
      </Row>
    </div>
  )
}

export default RecentPostItem
