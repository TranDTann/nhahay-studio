'use client'

import { MdOutlineDateRange } from 'react-icons/md'
import CategoryTag from '../../components/CategoryTag/CategoryTag'
import { TPost } from '../types'
import { FaRegUserCircle } from 'react-icons/fa'
import './styles.css'

type TTrendingPostItemProps = {
  postData: TPost
}

const TrendingPostItem = ({ postData }: TTrendingPostItemProps) => {
  return (
    <div className="trending-post-item-container">
      <div className="trending-post-item-image-container">
        <img
          src={postData.photo}
          alt="image-product"
          className="trending-post-item-image image-hover-zoom"
        />
        <div className="trending-category-tag">
          <CategoryTag tagName={postData.category} />
        </div>
      </div>
      <div className="trending-post-item-content">
        <h3 className="trending-post-item-title display-max-2-lines">
          {postData.title}
        </h3>
        <div className="trending-post-info-container">
          <div className="trending-post-info-item">
            <FaRegUserCircle color="#bacce1" />
            <p>{postData.author}</p>
          </div>
          <div className="trending-post-item">
            <MdOutlineDateRange color="#bacce1" /> <p>{postData.date}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrendingPostItem
