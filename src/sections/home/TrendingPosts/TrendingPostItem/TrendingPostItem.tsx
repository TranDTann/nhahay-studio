'use client'

import paths from '@/routes/paths'
import { Article } from '@/store/article/crud'
import { useRouter } from 'next/navigation'
import { FaRegUserCircle } from 'react-icons/fa'
import { MdOutlineDateRange } from 'react-icons/md'
import CategoryTag from '../../components/CategoryTag/CategoryTag'
import './styles.css'

type TTrendingPostItemProps = {
  postData: Article
}

const TrendingPostItem = ({ postData }: TTrendingPostItemProps) => {
  const router = useRouter()

  const navigateToPostDetail = () => {
    router.push(paths.dashboard.postDetail(postData.id))
  }

  return (
    <div className="trending-post-item-container">
      <div
        className="trending-post-item-image-container image-hover-zoom-container"
        onClick={navigateToPostDetail}
      >
        <img
          src={postData.image}
          alt="TrendingPost-image"
          className="trending-post-item-image image-hover-zoom"
        />
        <div className="trending-category-tag">
          <CategoryTag tagName={postData.category?.name} />
        </div>
      </div>
      <div className="trending-post-item-content">
        <h3
          className="trending-post-item-title display-max-2-lines"
          onClick={navigateToPostDetail}
        >
          {postData.title}
        </h3>
        <div className="trending-post-info-container">
          <div className="trending-post-info-item">
            <FaRegUserCircle color="#bacce1" />
            <p>{postData.createdByUser.username}</p>
          </div>
          <div className="trending-post-item">
            <MdOutlineDateRange color="#bacce1" /> <p>{postData.publishAt}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrendingPostItem
