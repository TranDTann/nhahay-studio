import { Col, Flex, Row, Skeleton } from 'antd'
import './VideosSkeleton.css'

const TrendingPostsSkeleton = () => {
  return (
    <div id="VideosSkeleton">
      <div className="video-skeleton_header">
        <Skeleton.Input active size="default" />
      </div>
      <Flex vertical gap={24} className="video-list">
        {Array.from({ length: 4 }).map((_, index) => (
          <Row key={index} gutter={24}>
            <Col span={14}>
              <Skeleton.Node active className="video-image-wrapper_node" />
            </Col>
            <Col span={10}>
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
