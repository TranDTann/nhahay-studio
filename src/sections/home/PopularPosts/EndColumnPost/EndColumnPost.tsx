import { Col, Row } from 'antd'
import { TPopularPost } from '../types'
import './styles.css'

type TEndColumnPostProps = {
  post: TPopularPost
}

const EndColumnPost = ({ post }: TEndColumnPostProps) => {
  return (
    <Row gutter={24} className="end-post-container">
      <Col span={8}>
        <div className="end-post-image-container">
          <img
            src={post.photo}
            alt="end-post-image"
            className="end-post-image image-hover-zoom"
          />
        </div>
      </Col>
      <Col span={16} className="end-post-info">
        <h2 className="display-max-3-lines end-post-title">{post.name}</h2>
        <div className="end-post-footer">
          <p>{post.author}</p>
          <span className="end-post_time">{post.date} | </span>
          {post.readMins}
        </div>
      </Col>
    </Row>
  )
}

export default EndColumnPost
