import { Col, Row } from 'antd'
import { TPopularPost } from '../types'
import './styles.css'

type TCenterColumnPostProps = {
  post: TPopularPost
}

const CenterColumnPost = ({ post }: TCenterColumnPostProps) => {
  return (
    <Row gutter={24} className="center-post-container">
      <Col span={12}>
        <div className="center-post-image-container">
          <img
            src={post.photo}
            alt="center-post-image"
            className="center-post-image image-hover-zoom"
          />
        </div>
      </Col>
      <Col span={12} className="center-post-info">
        <h2 className="display-max-2-lines center-post-title">{post.name}</h2>
        <p className="display-max-3-lines center-post-description">
          {post.content}
        </p>
        <div className="center-post-footer">
          <p>{post.author}</p>
          <span className="center-post_time">{post.date} | </span>
          {post.readMins}
        </div>
      </Col>
    </Row>
  )
}

export default CenterColumnPost
