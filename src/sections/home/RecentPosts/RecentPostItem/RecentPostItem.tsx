'use client'

import paths from '@/routes/paths'
import { Article } from '@/store/article/crud'
import { useRouter } from 'next/navigation'
import CategoryTag from '../../components/CategoryTag/CategoryTag'
import PostMeta from '../../components/PostMeta/PostMeta'
import './styles.scss'

type TRecentPostItemProps = {
  postData: Article
}

const RecentPostItem = ({ postData }: TRecentPostItemProps) => {
  const router = useRouter()

  const navigateToPostDetail = () => {
    router.push(
      paths.dashboard.postDetail({ id: postData.id, title: postData.title })
    )
  }

  return (
    <div id="RecentPostItem">
      <div className="post-item-container">
        <div
          className="post-item-image-container image-hover-zoom-container"
          onClick={navigateToPostDetail}
        >
          <img
            src={postData.image}
            alt="RecentPost-image"
            className="post-item-image image-hover-zoom"
          />
        </div>
        <div className="post-item-content">
          <CategoryTag tagName={postData.category?.name} />
          <h3
            className="post-item-title display-max-2-lines"
            onClick={navigateToPostDetail}
          >
            {postData.title}
          </h3>
          <PostMeta
            author={postData?.authorName ?? postData.createdByUser.username}
          />
        </div>
      </div>
    </div>
  )
}

export default RecentPostItem
