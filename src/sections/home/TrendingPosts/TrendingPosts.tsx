'use client'

import { MOCK_TRENDING_POSTS } from './data'
import MainTrendingPost from './MainTrendingPost/MainTrendingPost'
import TrendingPostItem from './TrendingPostItem/TrendingPostItem'
import BlockHeader from '../components/BlockHeader/BlockHeader'
import './styles.css'

const TrendingPosts = () => {
  const mainPost = MOCK_TRENDING_POSTS[0]
  const belowPosts = MOCK_TRENDING_POSTS.slice(1)

  return (
    <div>
      <BlockHeader title="Trending" />
      <MainTrendingPost postData={mainPost} />
      <div className="below-posts-container">
        {belowPosts.map((post) => (
          <TrendingPostItem key={post.id} postData={post} />
        ))}
      </div>
    </div>
  )
}

export default TrendingPosts
