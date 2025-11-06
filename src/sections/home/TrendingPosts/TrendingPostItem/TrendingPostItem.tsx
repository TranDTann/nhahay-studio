import paths from '@/routes/paths'
import { Article } from '@/store/article/crud'
import { Col, Row } from 'antd'
import { useRouter } from 'next/navigation'
import PostMeta from '../../components/PostMeta/PostMeta'
import './styles.scss'

type TTrendingPostItemProps = {
  post: Article
}

const TrendingPostItem = ({ post }: TTrendingPostItemProps) => {
  const router = useRouter()

  const navigateToPostDetail = () => {
    router.push(paths.dashboard.postDetail({ id: post.id, title: post.title }))
  }
  return (
    <div id="TrendingPostItem">
      <Row gutter={24} className="trending-post-item-container">
        <Col span={8}>
          <div
            className="trending-post-item-image-container image-hover-zoom-container"
            onClick={navigateToPostDetail}
          >
            <img
              src={post.image}
              alt="trending-post-image"
              className="trending-post-item-image image-hover-zoom"
            />
          </div>
        </Col>
        <Col span={16} className="trending-post-item-info">
          <h2
            className="display-max-2-lines trending-post-item-title"
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

export default TrendingPostItem
