'use client'

import { Col, Row } from 'antd'
import { FirstPost } from './FirstPost'
import { POPULAR_POSTS } from './data'
import { CenterColumnPost } from './ CenterColumnPost'
import { EndColumnPost } from './EndColumnPost'
import './styles.css'

const PopularPosts = () => {
  const firstPost = POPULAR_POSTS[0]
  const centerColumnPosts = POPULAR_POSTS.slice(1, 3) ?? []
  const endColumnPosts = POPULAR_POSTS.slice(3) ?? []

  return (
    <div>
      <h1 className="popular-post-title">Phổ biến</h1>
      <Row gutter={24}>
        <Col span={8} className="first-post-wrapper">
          <FirstPost post={firstPost} />
        </Col>
        <Col span={8} className="center-post-wrapper">
          {centerColumnPosts.map((postItem) => (
            <CenterColumnPost key={postItem.id} post={postItem} />
          ))}
        </Col>
        <Col span={8} className="end-post-wrapper">
          {endColumnPosts.map((postItem) => (
            <EndColumnPost key={postItem.id} post={postItem} />
          ))}
        </Col>
      </Row>
    </div>
  )
}

export default PopularPosts
