import { Col, Row, Skeleton } from 'antd'
import './FeaturedPostsSkeleton.css'

const FeaturedPostsSkeleton = () => {
  return (
    <div id="FeaturedPostsSkeleton">
      <Row gutter={[24, 24]} className="featured-posts-container_loading">
        <Col xs={24} md={24} lg={18} className="main-post-container_loading">
          <Skeleton.Node active className="skeleton-container" />
        </Col>
        <Col xs={24} md={24} lg={6} className="right-posts-wrapper_loading">
          <Skeleton.Node active className="skeleton-container" />
        </Col>
      </Row>
    </div>
  )
}

export default FeaturedPostsSkeleton
