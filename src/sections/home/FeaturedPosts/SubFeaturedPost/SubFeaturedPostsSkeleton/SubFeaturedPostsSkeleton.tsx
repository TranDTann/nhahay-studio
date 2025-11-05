import { Col, Row, Skeleton } from 'antd'
import '../styles.scss'
import './SubFeaturedPostsSkeleton.scss'

const SubFeaturedPostsSkeleton = () => (
  <div id="SubFeaturedPostsSkeleton">
    <Row gutter={24} className="sub-featured-post-container">
      <Col span={24}>
        <Skeleton.Node active className="skeleton-container" />
      </Col>
    </Row>
  </div>
)

export default SubFeaturedPostsSkeleton
