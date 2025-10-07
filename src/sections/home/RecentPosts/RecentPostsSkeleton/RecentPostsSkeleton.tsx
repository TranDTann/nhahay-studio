import { Skeleton, Row, Col } from 'antd'
import './RecentPostsSkeleton.css'
import '../styles.scss'

const RecentPostsSkeleton = () => {
  return (
    <div>
      <div className="recent-posts-skeleton_header">
        <Skeleton.Input active size="default" />
      </div>
      <Row gutter={24}>
        <Col span={16}>
          <Row gutter={24} className="recent-posts-container">
            <Col span={16} className="main-post-container">
              <Skeleton.Node className="main-post-container_node" active />
            </Col>
            <Col span={8}>
              <div className="right-posts-grid">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton.Node
                    key={i}
                    active
                    className="post-item-container_skeleton"
                  />
                ))}
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Skeleton.Node className="recent-posts-advertising_node" active />
        </Col>
      </Row>
    </div>
  )
}

export default RecentPostsSkeleton
