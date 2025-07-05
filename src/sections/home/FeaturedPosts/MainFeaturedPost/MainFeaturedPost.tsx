'use client'

import { FaRegUserCircle } from 'react-icons/fa'
import { IoIosTimer } from 'react-icons/io'
import { MdOutlineDateRange } from 'react-icons/md'
import { TPost } from '../types'
import CategoryTag from '../../components/CategoryTag/CategoryTag'
import './styles.css'

type TMainFeaturedPostProps = {
  postData: TPost
}

const MainFeaturedPost = ({ postData }: TMainFeaturedPostProps) => {
  return (
    <div className="featured-post-container">
      <div className="featured-post-image-container">
        <img
          src={postData.photo}
          alt="image-product"
          className="featured-post-image image-hover-zoom"
        />
      </div>
      <div className="featured-post-content">
        <CategoryTag tagName={postData.category} />
        <h3 className="featured-post-title display-max-3-lines">
          {postData.title}
        </h3>
        <div className="featured-post-info-container">
          <div className="featured-post-info-item">
            <FaRegUserCircle color="#bacce1" />
            <p>{postData.author}</p>
          </div>
          <div className="featured-post-info-item">
            <IoIosTimer color="#bacce1" />
            <p>{postData.readMins}</p>
          </div>
          <div className="featured-post-info-item">
            <MdOutlineDateRange color="#bacce1" />
            <p>{postData.date}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainFeaturedPost
