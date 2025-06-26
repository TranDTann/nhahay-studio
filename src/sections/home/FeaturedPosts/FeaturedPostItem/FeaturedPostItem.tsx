'use client'

import { MdOutlineDateRange } from 'react-icons/md'
import { TPost } from '../types'
import CategoryTag from '../../components/CategoryTag/CategoryTag'
import './styles.css'

type TFeaturedPostItemProps = {
  postData: TPost
}

const FeaturedPostItem = ({ postData }: TFeaturedPostItemProps) => {
  return (
    <div className="post-item-container">
      <img
        src={postData.photo}
        alt="image-product"
        className="post-item-image"
      />
      <div className="post-item-content">
        <CategoryTag tagName={postData.category} />
        <h3 className="post-item-title">{postData.title}</h3>
        <div className="post-item-date">
          <MdOutlineDateRange color="#bacce1" /> <p>{postData.date}</p>
        </div>
      </div>
    </div>
  )
}

export default FeaturedPostItem
