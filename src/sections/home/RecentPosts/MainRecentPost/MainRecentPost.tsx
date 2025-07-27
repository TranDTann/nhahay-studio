'use client'

import { Article } from '@/store/article/crud'
import { FaRegUserCircle } from 'react-icons/fa'
import { IoIosTimer } from 'react-icons/io'
import { MdOutlineDateRange } from 'react-icons/md'
import CategoryTag from '../../components/CategoryTag/CategoryTag'
import './styles.css'

type TMainRecentPostProps = {
  postData: Article
}

const MainRecentPost = ({ postData }: TMainRecentPostProps) => {
  return (
    <div className="post-container">
      <div className="post-image-container">
        <img
          src={postData.image}
          alt="image-product"
          className="post-image image-hover-zoom"
        />
      </div>
      <div className="post-content">
        <CategoryTag tagName={postData.category?.name} />
        <h3 className="post-title display-max-3-lines">{postData.title}</h3>
        <div className="post-info-container">
          <div className="post-info-item">
            <FaRegUserCircle color="#bacce1" />
            <p>{postData.createdBy}</p>
          </div>
          <div className="post-info-item">
            <IoIosTimer color="#bacce1" />
            <p>{postData.ratingAvg}</p>
          </div>
          <div className="post-info-item">
            <MdOutlineDateRange color="#bacce1" />
            <p>{postData.publishAt}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainRecentPost
