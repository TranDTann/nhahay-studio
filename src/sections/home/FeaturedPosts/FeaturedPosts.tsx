'use client'

import { Col, Row } from 'antd'
import { MOCK_FEATURE_POSTS } from './data'
import FeaturedPostItem from './FeaturedPostItem/FeaturedPostItem'
import MainFeaturedPost from './MainFeaturedPost/MainFeaturedPost'
import './styles.css'

const FeaturedPosts = () => {
  const mainPost = MOCK_FEATURE_POSTS[0]
  const rightColumnPosts = MOCK_FEATURE_POSTS.slice(1)

  return (
    <Row gutter={24} className="featured-posts-container">
      <Col span={16} className="main-post-container">
        <MainFeaturedPost postData={mainPost} />
      </Col>
      <Col span={8} className="right-posts-column-wrapper">
        <div className="right-posts-grid">
          {rightColumnPosts.map((post) => (
            <FeaturedPostItem key={post.id} postData={post} />
          ))}
        </div>
      </Col>
    </Row>
  )
}

export default FeaturedPosts
