'use client'

import paths from '@/routes/paths'
import { Article } from '@/store/article/crud'
import { useRouter } from 'next/navigation'
import CategoryTag from '../../components/CategoryTag/CategoryTag'
import PostMeta from '../../components/PostMeta/PostMeta'
import './styles.scss'

type TMainFeaturedPostProps = {
  postData: Article
}

const MainFeaturedPost = ({ postData }: TMainFeaturedPostProps) => {
  const router = useRouter()

  const navigateToPostDetail = () => {
    router.push(
      paths.dashboard.postDetail({ id: postData.id, title: postData.title })
    )
  }

  return (
    <div id="MainFeaturedPost">
      <div
        className="featured-post-container image-hover-zoom-container"
        onClick={navigateToPostDetail}
      >
        <div className="featured-post-image-container">
          <img
            src={postData.image}
            alt="MainFeatured-image"
            className="featured-post-image image-hover-zoom"
          />
        </div>
        <div className="featured-post-content">
          <CategoryTag tagName={postData.category?.name} />
          <h3 className="featured-post-title display-max-3-lines">
            {postData.title}
          </h3>
          <PostMeta
            author={postData.createdByUser.username}
            readingTimeMinutes={postData.readingTimeMinutes}
            publishTime={postData.publishAt}
          />
        </div>
      </div>
    </div>
  )
}

export default MainFeaturedPost
