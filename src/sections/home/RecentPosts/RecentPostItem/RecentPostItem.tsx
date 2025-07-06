'use client'

import { MdOutlineDateRange } from 'react-icons/md'
import CategoryTag from '../../components/CategoryTag/CategoryTag'
import { TPost } from '../types'
import './styles.css'

type TRecentPostItemProps = {
  postData: TPost
}

const RecentPostItem = ({ postData }: TRecentPostItemProps) => {
  return (
    <div className="post-item-container">
      <div className="post-item-image-container">
        <img
          src={postData.photo}
          alt="image-product"
          className="post-item-image image-hover-zoom"
        />
      </div>
      <div className="post-item-content">
        <CategoryTag tagName={postData.category} />
        <h3 className="post-item-title display-max-2-lines">
          {postData.title}
        </h3>
        <div className="post-item-date">
          <MdOutlineDateRange color="#bacce1" /> <p>{postData.date}</p>
        </div>
      </div>
    </div>
  )
}

export default RecentPostItem
