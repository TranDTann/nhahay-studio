import paths from '@/routes/paths'
import { Article } from '@/store/article/crud'
import { Col, Row } from 'antd'
import parse from 'html-react-parser'
import { useRouter } from 'next/navigation'
import PostMeta from '../../components/PostMeta/PostMeta'
import './styles.css'

type TCenterColumnPostProps = {
  post: Article
}

const CenterColumnPost = ({ post }: TCenterColumnPostProps) => {
  const router = useRouter()

  const navigateToPostDetail = () => {
    router.push(paths.dashboard.postDetail(post.id))
  }

  return (
    <Row gutter={24} className="center-post-container">
      <Col span={12}>
        <div
          className="center-post-image-container image-hover-zoom-container"
          onClick={navigateToPostDetail}
        >
          <img
            src={post.image}
            alt="center-post-image"
            className="center-post-image image-hover-zoom"
          />
        </div>
      </Col>
      <Col span={12} className="center-post-info">
        <h2
          className="display-max-2-lines center-post-title"
          onClick={navigateToPostDetail}
        >
          {post.title}
        </h2>
        <p className="display-max-3-lines center-post-description">
          {parse(post.description ?? '')}
        </p>
        <PostMeta author={post.createdByUser.username} />
      </Col>
    </Row>
  )
}

export default CenterColumnPost
