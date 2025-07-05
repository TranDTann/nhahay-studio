'use client'

import { Col, Row } from 'antd'
import RecentPostItem from './RecentPostItem/RecentPostItem'
import { MOCK_RECENT_POSTS } from './data'
import MainRecentPost from './MainRecentPost/MainRecentPost'
import './styles.css'
import { RecentPostsAdvertising } from './RecentPostsAdvertising'

const RecentPosts = () => {
  const mainPost = MOCK_RECENT_POSTS[0]
  const rightColumnPosts = MOCK_RECENT_POSTS.slice(1)

  const recentPostsContent = (
    <Row gutter={24} className="recent-posts-container">
      <Col span={16} className="main-post-container">
        <MainRecentPost postData={mainPost} />
      </Col>
      <Col span={8} className="right-posts-column-wrapper">
        <div className="right-posts-grid">
          {rightColumnPosts.map((post) => (
            <RecentPostItem key={post.id} postData={post} />
          ))}
        </div>
      </Col>
    </Row>
  )

  return (
    <div>
      <h1 className="recent-posts-title">Bài viết gần đây</h1>
      <Row gutter={24}>
        <Col span={16}>{recentPostsContent}</Col>
        <Col span={8}>
          <RecentPostsAdvertising />
        </Col>
      </Row>
    </div>
  )
}

export default RecentPosts
