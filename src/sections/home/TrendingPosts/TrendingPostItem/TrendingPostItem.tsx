'use client'

import { Article } from '@/store/article/crud'
import { FaRegUserCircle } from 'react-icons/fa'
import { MdOutlineDateRange } from 'react-icons/md'
import CategoryTag from '../../components/CategoryTag/CategoryTag'
import './styles.css'

type TTrendingPostItemProps = {
  postData: Article
}

const TrendingPostItem = ({ postData }: TTrendingPostItemProps) => {
  return (
    <div className="trending-post-item-container">
      <div className="trending-post-item-image-container">
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
        <h3 className="trending-post-item-title display-max-2-lines">
          {postData.title}
        </h3>
        <div className="trending-post-info-container">
          <div className="trending-post-info-item">
            <FaRegUserCircle color="#bacce1" />
            <p>{postData.createdBy}</p>
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
