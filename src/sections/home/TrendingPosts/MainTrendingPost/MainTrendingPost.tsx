'use client'

import { Col, Row } from 'antd'
import { FaRegUserCircle } from 'react-icons/fa'
import { IoIosTimer } from 'react-icons/io'
import { MdOutlineDateRange } from 'react-icons/md'
import { TPost } from '../types'
import CategoryTag from '../../components/CategoryTag/CategoryTag'
import './styles.css'

type TMainTrendingPostProps = {
  postData: TPost
}

const MainTrendingPost = ({ postData }: TMainTrendingPostProps) => {
  return (
    <div className="trending-post-container">
      <Row gutter={24}>
        <Col span={12}>
          <img
            src={postData.photo}
            alt="image-product"
            className="trending-post-image"
          />
        </Col>
        <Col span={12}>
          <div className="trending-post-content">
            <CategoryTag tagName={postData.category} />
            <h3 className="trending-post-title display-max-3-lines">
              {postData.title}
            </h3>
            <div className="trending-post-info-container">
              <div className="trending-post-info-item">
                <FaRegUserCircle color="#bacce1" />
                <p>{postData.author}</p>
              </div>
              <div className="trending-post-info-item">
                <IoIosTimer color="#bacce1" />
                <p>{postData.readMins}</p>
              </div>
              <div className="trending-post-info-item">
                <MdOutlineDateRange color="#bacce1" />
                <p>{postData.date}</p>
              </div>
            </div>
            <div className="trending-post-description">{postData.content}</div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default MainTrendingPost
