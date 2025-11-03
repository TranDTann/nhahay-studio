import { Col, Row, Skeleton } from 'antd'
import '../styles.scss'
import './FeaturedPostsSkeleton.css'

const FeaturedPostsSkeleton = () => {
  return (
    <div id="FeaturedPosts">
      <Row gutter={[24, 24]} className="featured-posts-container">
        <Col xs={24} md={24} lg={18} className="main-post-container">
          <Skeleton.Node active className="skeleton-container" />
        </Col>
        <Col xs={24} md={24} lg={6} className="right-posts-wrapper">
          <Skeleton.Node active className="skeleton-container" />
        </Col>
      </Row>
    </div>
  )
}

export default FeaturedPostsSkeleton
