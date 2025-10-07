import { Col, Row, Skeleton } from 'antd'
import '../styles.scss'
import './PopularPostsSkeleton.css'

const PopularPostsSkeleton = () => {
  return (
    <div>
      <div className="polular-posts-skeleton_header">
        <Skeleton.Input active size="default" />
      </div>
      <Row gutter={24} style={{ height: '100%' }}>
        <Col span={8} className="first-post-wrapper">
          <Skeleton.Node active className="first-post-wrapper_node" />
          <div>
            <Skeleton.Input active className="w-full" size="small" />
            <Skeleton
              active
              paragraph={{ rows: 3 }}
              style={{ marginTop: 16 }}
            />
          </div>
        </Col>
        <Col span={8} className="center-post-wrapper">
          {Array.from({ length: 2 }).map((_, i) => (
            <Row key={i} gutter={24} className="center-post-container">
              <Col span={12}>
                <div className="center-post-image-container">
                  <Skeleton.Node
                    className="center-post-image-container_node"
                    active
                  />
                </div>
              </Col>
              <Col span={12} className="center-post-info">
                <Skeleton.Input active className="w-full" size="small" />
                <Skeleton.Input active className="w-full" size="small" />
                <Skeleton
                  active
                  paragraph={{ rows: 1 }}
                  style={{ marginTop: 8 }}
                />
                <Skeleton.Input active className="w-full" size="small" />
              </Col>
            </Row>
          ))}
        </Col>
        <Col span={8} className="end-post-wrapper">
          {Array.from({ length: 3 }).map((_, i) => (
            <Row gutter={24}>
              <Col span={8}>
                <Skeleton.Node active className="end-post-wrapper_node" />
              </Col>
              <Col span={16} className="end-post-info">
                <Skeleton.Input active className="w-full" size="small" />
                <Skeleton
                  active
                  paragraph={{ rows: 1 }}
                  style={{ marginTop: 8 }}
                />
              </Col>
            </Row>
          ))}
        </Col>
      </Row>
    </div>
  )
}

export default PopularPostsSkeleton
