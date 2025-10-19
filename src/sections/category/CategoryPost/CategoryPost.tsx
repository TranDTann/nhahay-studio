'use client'

import paths from '@/routes/paths'
import { Article } from '@/store/article/crud'
import { formatDateDisplay } from '@/utils/formatDate'
import parse from 'html-react-parser'
import { useRouter } from 'next/navigation'
import './styles.scss'

type TCategoryPostProps = {
  postData: Article
}

const CategoryPost = ({ postData }: TCategoryPostProps) => {
  const router = useRouter()

  const navigateToPostDetail = () => {
    router.push(
      paths.dashboard.postDetail({ id: postData.id, title: postData.title })
    )
  }

  return (
    <div className="category-post-container">
      <img
        src={postData.image}
        alt="category-post-image"
        className="category-post-image"
        onClick={navigateToPostDetail}
      />
      <div className="category-post-info">
        <div>
          <h3
            className="category-post-title display-max-3-lines"
            onClick={navigateToPostDetail}
          >
            {postData.title}
          </h3>
          <div className="category-post-content display-max-3-lines">
            {parse(postData.description ?? '')}
          </div>
        </div>
        <div>
          <p className="category-post-author">
            {postData?.authorName ?? postData?.createdByUser?.username}
          </p>
          <div>
            <span className="category-post-publish-time">
              {formatDateDisplay(postData.publishAt)}
            </span>
            {' | '}
            <span className="category-post-read-mins">
              {postData.readingTimeMinutes} phút đọc
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryPost
