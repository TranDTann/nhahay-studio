'use client'

import { MdOutlineDateRange } from 'react-icons/md'
import CategoryTag from '../../components/CategoryTag/CategoryTag'
import { TPost } from '../types'
import './styles.css'

type TFeaturedPostItemProps = {
  postData: TPost
}

const FeaturedPostItem = ({ postData }: TFeaturedPostItemProps) => {
  return (
    <div className="featured-post-item-container">
      <div className="featured-post-item-image-container">
        <img
          src={postData.photo}
          alt="image-product"
          className=" featured-post-item-image image-hover-zoom"
        />
      </div>
      <div className="featured-post-item-content">
        <CategoryTag tagName={postData.category} />
        <h3 className="featured-post-item-title display-max-2-lines">
          {postData.title}
        </h3>
        <div className="featured-post-item-date">
          <MdOutlineDateRange color="#bacce1" /> <p>{postData.date}</p>
        </div>
      </div>
    </div>
  )
}

export default FeaturedPostItem
