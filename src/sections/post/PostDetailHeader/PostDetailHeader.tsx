'use client'

import { Article } from '@/store/article/crud'
import { formatDateDisplay } from '@/utils/formatDate'
import { Divider } from 'antd'
import { FaUser } from 'react-icons/fa'
import './styles.css'

type TPostDetailHeaderProps = {
  postData: Article
}

const PostDetailHeader = ({ postData }: TPostDetailHeaderProps) => {
  return (
    <div className="post-detail-header-container">
      <p className="post-detail-title">{postData.title}</p>
      <div className="post-detail-header-info">
        <FaUser />
        <div className="post-detail-header-info_author">
          <p className="post-detail-header_author-name">
            {postData.createdByUser.username}
            <Divider type="vertical" style={{ borderColor: '#bababa' }} />
          </p>
          <p>
            {formatDateDisplay(postData.publishAt)}
            <Divider type="vertical" style={{ borderColor: '#bababa' }} />
          </p>

          <div>
            <span>{postData.readingTimeMinutes} phút đọc</span>
            <Divider type="vertical" style={{ borderColor: '#bababa' }} />
            <span>{postData.ratingAvg}*</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetailHeader
