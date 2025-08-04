'use client'

import { Article } from '@/store/article/crud'
import { FaRegUserCircle } from 'react-icons/fa'
import { IoIosTimer } from 'react-icons/io'
import { MdOutlineDateRange } from 'react-icons/md'
import CategoryTag from '../../components/CategoryTag/CategoryTag'
import './styles.css'

type TMainFeaturedPostProps = {
  postData: Article
}

const MainFeaturedPost = ({ postData }: TMainFeaturedPostProps) => {
  return (
    <div className="featured-post-container image-hover-zoom-container">
      <div className="featured-post-image-container">
        <img
          src={postData.image}
          alt="MainFeatured-image"
          className="featured-post-image image-hover-zoom"
        />
      </div>
      <div className="featured-post-content">
        <CategoryTag tagName={postData.category?.name} />
        <h3 className="featured-post-title display-max-3-lines">
          {postData.title}
        </h3>
        <div className="featured-post-info-container">
          <div className="featured-post-info-item">
            <FaRegUserCircle color="#bacce1" />
            <p>{postData.createdBy}</p>
          </div>
          <div className="featured-post-info-item">
            <IoIosTimer color="#bacce1" />
            <p>{postData.readingTimeMinutes} mins</p>
          </div>
          <div className="featured-post-info-item">
            <MdOutlineDateRange color="#bacce1" />
            <p>{postData.publishAt}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainFeaturedPost
