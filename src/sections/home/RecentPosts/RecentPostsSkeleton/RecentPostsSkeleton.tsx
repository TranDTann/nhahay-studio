import { Col, Flex, Row, Skeleton } from 'antd'
import './RecentPostsSkeleton.css'

const RecentPostsSkeleton = () => {
  return (
    <div id="RecentPostItem">
      <div className="recent-posts-skeleton_header">
        <Skeleton.Input active size="default" />
      </div>
      <Flex vertical gap={24}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Row key={index} gutter={24}>
            <Col span={8}>
              <Skeleton.Node
                active
                className="recent-post-image-wrapper_node"
              />
            </Col>
            <Col span={16}>
              <Skeleton
                active
                paragraph={{ rows: 5 }}
                style={{ marginTop: 8 }}
              />
            </Col>
          </Row>
        ))}
      </Flex>
    </div>
  )
}

export default RecentPostsSkeleton
