import paths from '@/routes/paths'
import { Article } from '@/store/article/crud'
import { Col, Row } from 'antd'
import { useRouter } from 'next/navigation'
import PostMeta from '../../components/PostMeta/PostMeta'
import './styles.scss'

type TPopularPostItemProps = {
  post: Article
}

const PopularPostItem = ({ post }: TPopularPostItemProps) => {
  const router = useRouter()

  const navigateToPostDetail = () => {
    router.push(paths.dashboard.postDetail({ id: post.id, title: post.title }))
  }
  return (
    <div id="PopularPostItem">
      <Row gutter={24} className="popular-post-item-container">
        <Col span={8}>
          <div
            className="popular-post-item-image-container image-hover-zoom-container"
            onClick={navigateToPostDetail}
          >
            <img
              src={post.image}
              alt="popular-post-image"
              className="popular-post-item-image image-hover-zoom"
            />
          </div>
        </Col>
        <Col span={16} className="popular-post-item-info">
          <h2
            className="display-max-2-lines popular-post-item-title"
            onClick={navigateToPostDetail}
          >
            {post.title}
          </h2>
          <PostMeta
            author={post?.authorName ?? post?.createdByUser?.username}
          />
        </Col>
      </Row>
    </div>
  )
}

export default PopularPostItem
