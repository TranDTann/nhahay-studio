import { Col, Row, Skeleton } from 'antd'
import '../styles.scss'
import './FeaturedPostsSkeleton.css'

const FeaturedPostsSkeleton = () => {
  return (
    <Row gutter={24} className="featured-posts-container">
      <Col span={16} className="main-post-container">
        <Skeleton.Node active className="skeleton-container" />
      </Col>
      <Col span={8} className="right-posts-column-wrapper">
        <div className="right-posts-grid">
          {Array.from({ length: 3 }).map((item, index) => (
            <Skeleton.Node key={index} active className="skeleton-container" />
          ))}
        </div>
      </Col>
    </Row>
  )
}

export default FeaturedPostsSkeleton
