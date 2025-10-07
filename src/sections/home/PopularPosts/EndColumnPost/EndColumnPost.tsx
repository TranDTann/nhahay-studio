import paths from '@/routes/paths'
import { Article } from '@/store/article/crud'
import { Col, Row } from 'antd'
import { useRouter } from 'next/navigation'
import PostMeta from '../../components/PostMeta/PostMeta'
import './styles.scss'

type TEndColumnPostProps = {
  post: Article
}

const EndColumnPost = ({ post }: TEndColumnPostProps) => {
  const router = useRouter()

  const navigateToPostDetail = () => {
    router.push(paths.dashboard.postDetail(post.id))
  }

  return (
    <div id="EndColumnPost">
      <Row gutter={24} className="end-post-container">
        <Col span={8}>
          <div
            className="end-post-image-container image-hover-zoom-container"
            onClick={navigateToPostDetail}
          >
            <img
              src={post.image}
              alt="end-post-image"
              className="end-post-image image-hover-zoom"
            />
          </div>
        </Col>
        <Col span={16} className="end-post-info">
          <h2
            className="display-max-2-lines end-post-title"
            onClick={navigateToPostDetail}
          >
            {post.title}
          </h2>
          <PostMeta author={post.createdByUser.username} />
        </Col>
      </Row>
    </div>
  )
}

export default EndColumnPost
