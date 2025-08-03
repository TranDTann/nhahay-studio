'use client'

import { Article } from '@/store/article/crud'
import { MdOutlineDateRange } from 'react-icons/md'
import CategoryTag from '../../components/CategoryTag/CategoryTag'
import './styles.css'

type TRecentPostItemProps = {
  postData: Article
}

const RecentPostItem = ({ postData }: TRecentPostItemProps) => {
  return (
    <div className="post-item-container">
      <div className="post-item-image-container">
        <img
          src={postData.image}
          alt="RecentPost-image"
          className="post-item-image image-hover-zoom"
        />
      </div>
      <div className="post-item-content">
        <CategoryTag tagName={postData.category?.name} />
        <h3 className="post-item-title display-max-2-lines">
          {postData.title}
        </h3>
        <div className="post-item-date">
          <MdOutlineDateRange color="#bacce1" /> <p>{postData.publishAt}</p>
        </div>
      </div>
    </div>
  )
}

export default RecentPostItem
