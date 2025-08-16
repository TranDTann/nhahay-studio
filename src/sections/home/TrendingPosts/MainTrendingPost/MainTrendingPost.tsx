'use client'

import paths from '@/routes/paths'
import { Article } from '@/store/article/crud'
import { Col, Row } from 'antd'
import parse from 'html-react-parser'
import { useRouter } from 'next/navigation'
import { FaRegUserCircle } from 'react-icons/fa'
import { IoIosTimer } from 'react-icons/io'
import { MdOutlineDateRange } from 'react-icons/md'
import CategoryTag from '../../components/CategoryTag/CategoryTag'
import './styles.css'

type TMainTrendingPostProps = {
  postData: Article
}

const MainTrendingPost = ({ postData }: TMainTrendingPostProps) => {
  const router = useRouter()

  const navigateToPostDetail = () => {
    router.push(paths.dashboard.postDetail(postData.id))
  }

  return (
    <div className="trending-post-container">
      <Row gutter={24}>
        <Col span={12}>
          <div
            className="trending-post-image-container image-hover-zoom-container"
            onClick={navigateToPostDetail}
          >
            <img
              src={postData.image}
              alt="MainTrendingPost-image"
              className="trending-post-image image-hover-zoom"
            />
          </div>
        </Col>
        <Col span={12}>
          <div className="trending-post-content">
            <CategoryTag tagName={postData.category?.name} />
            <h3
              className="trending-post-title display-max-3-lines"
              onClick={navigateToPostDetail}
            >
              {postData.title}
            </h3>
            <div className="trending-post-info-container">
              <div className="trending-post-info-item">
                <FaRegUserCircle color="#bacce1" />
                <p>{postData.createdByUser.username}</p>
              </div>
              <div className="trending-post-info-item">
                <IoIosTimer color="#bacce1" />
                <p>{postData.readingTimeMinutes} mins</p>
              </div>
              <div className="trending-post-info-item">
                <MdOutlineDateRange color="#bacce1" />
                <p>{postData.publishAt}</p>
              </div>
            </div>
            <div className="trending-post-description">
              {parse(postData.content ?? '')}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default MainTrendingPost
