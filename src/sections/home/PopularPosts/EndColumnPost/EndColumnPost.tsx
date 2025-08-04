import { Article } from '@/store/article/crud'
import { Col, Row } from 'antd'
import './styles.css'

type TEndColumnPostProps = {
  post: Article
}

const EndColumnPost = ({ post }: TEndColumnPostProps) => {
  return (
    <Row gutter={24} className="end-post-container">
      <Col span={8}>
        <div className="end-post-image-container image-hover-zoom-container">
          <img
            src={post.image}
            alt="end-post-image"
            className="end-post-image image-hover-zoom"
          />
        </div>
      </Col>
      <Col span={16} className="end-post-info">
        <h2 className="display-max-3-lines end-post-title">{post.title}</h2>
        <div className="end-post-footer">
          <p>{post.createdBy}</p>
          <span className="end-post_time">{post.publishAt} | </span>
          {post.readingTimeMinutes} mins
        </div>
      </Col>
    </Row>
  )
}

export default EndColumnPost
