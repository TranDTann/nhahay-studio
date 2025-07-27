import { Skeleton, Row, Col } from 'antd'
import './TrendingPostsSkeleton.css'

const TrendingPostsSkeleton = () => {
  return (
    <div>
      <div className="trending-posts-skeleton_header">
        <Skeleton.Input active size="default" />
      </div>
      <Row gutter={24} className="trending-posts-container">
        <Col span={16} className="main-trending-post-container">
          <Skeleton.Node className="main-trending-post-container_node" active />
        </Col>
        <Col span={8} style={{ marginTop: 16 }}>
          <Skeleton.Input active className="w-full" />
          <Skeleton active paragraph={{ rows: 7 }} style={{ marginTop: 16 }} />
        </Col>
      </Row>
      <Row gutter={24} className="sub-trending-post">
        {Array.from({ length: 3 }).map((_, i) => (
          <Col span={8} className="sub-trending-post-container">
            <Skeleton.Node
              active
              className="sub-trending-post-container_node"
            />
            <div className="sub-trending-post_input">
              <Skeleton.Input active className="w-full" />
              <Skeleton
                active
                paragraph={{ rows: 1 }}
                style={{ marginTop: 16 }}
              />
            </div>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default TrendingPostsSkeleton
