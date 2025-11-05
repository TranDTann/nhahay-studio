import { Col, Flex, Row, Skeleton } from 'antd'
import './TrendingPostsSkeleton.css'

const TrendingPostsSkeleton = () => {
  return (
    <div id="TrendingPostsSkeleton">
      <div className="trending-posts-skeleton_header">
        <Skeleton.Input active size="default" />
      </div>
      <Flex vertical gap={24}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Row key={index} gutter={24}>
            <Col span={8}>
              <Skeleton.Node
                active
                className="trending-post-image-wrapper_node"
              />
            </Col>
            <Col span={16}>
              <Skeleton
                active
                paragraph={{ rows: 2 }}
                style={{ marginTop: 8 }}
              />
            </Col>
          </Row>
        ))}
      </Flex>
    </div>
  )
}

export default TrendingPostsSkeleton
