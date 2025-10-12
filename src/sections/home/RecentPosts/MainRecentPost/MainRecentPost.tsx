'use client'

import paths from '@/routes/paths'
import { Article } from '@/store/article/crud'
import { useRouter } from 'next/navigation'
import CategoryTag from '../../components/CategoryTag/CategoryTag'
import PostMeta from '../../components/PostMeta/PostMeta'
import './styles.css'

type TMainRecentPostProps = {
  postData: Article
}

const MainRecentPost = ({ postData }: TMainRecentPostProps) => {
  const router = useRouter()

  const navigateToPostDetail = () => {
    router.push(
      paths.dashboard.postDetail({ id: postData.id, title: postData.title })
    )
  }

  return (
    <div onClick={navigateToPostDetail} className="post-container">
      <div className="post-image-container image-hover-zoom-container">
        <img
          src={postData.image}
          alt="MainRecentPost-image"
          className="post-image image-hover-zoom"
        />
      </div>
      <div className="post-content">
        <CategoryTag tagName={postData.category?.name} />
        <h3 className="post-title display-max-3-lines">{postData.title}</h3>
        <PostMeta
          author={postData.createdByUser.username}
          readingTimeMinutes={postData.readingTimeMinutes}
          publishTime={postData.publishAt}
        />
      </div>
    </div>
  )
}

export default MainRecentPost
