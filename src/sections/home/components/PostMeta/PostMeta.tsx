'use client'

import { FaRegUserCircle } from 'react-icons/fa'
import { IoIosTimer } from 'react-icons/io'
import { MdOutlineDateRange } from 'react-icons/md'
import './styles.css'

type TPostMetaProps = {
  author?: string
  readingTimeMinutes?: number
  publishTime?: string
}

const PostMeta = ({
  author,
  readingTimeMinutes,
  publishTime
}: TPostMetaProps) => {
  return (
    <div className="post-meta-container">
      {author && (
        <div className="post-meta-item">
          <FaRegUserCircle color="#bacce1" />
          <p>{author}</p>
        </div>
      )}
      {readingTimeMinutes && (
        <div className="post-meta-item">
          <IoIosTimer color="#bacce1" />
          <p>{readingTimeMinutes} phút đọc</p>
        </div>
      )}
      {publishTime && (
        <div className="post-meta-item">
          <MdOutlineDateRange color="#bacce1" />
          <p>{publishTime}</p>
        </div>
      )}
    </div>
  )
}

export default PostMeta
