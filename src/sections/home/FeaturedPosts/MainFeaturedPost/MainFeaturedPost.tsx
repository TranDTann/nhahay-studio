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
    <div className="post-container">
      <img src={postData.photo} alt="image-product" className="post-image" />
      <div className="post-content">
        <CategoryTag tagName={postData.category} />
        <h3 className="post-title">{postData.title}</h3>
        <div className="post-info-container">
          <div className="post-info-item">
            <FaRegUserCircle color="#bacce1" />
            <p>{postData.author}</p>
          </div>
          <div className="post-info-item">
            <IoIosTimer color="#bacce1" />
            <p>{postData.readMins}</p>
          </div>
          <div className="post-info-item">
            <MdOutlineDateRange color="#bacce1" />
            <p>{postData.date}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainFeaturedPost
