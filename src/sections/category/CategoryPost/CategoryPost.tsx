'use client'

import paths from '@/routes/paths'
import { Article } from '@/store/article/crud'
import parse from 'html-react-parser'
import { useRouter } from 'next/navigation'
import './styles.css'

type TCategoryPostProps = {
  postData: Article
}

const CategoryPost = ({ postData }: TCategoryPostProps) => {
  const router = useRouter()

  const navigateToPostDetail = () => {
    router.push(paths.dashboard.postDetail(postData.id))
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
        <h3
          className="category-post-title display-max-3-lines"
          onClick={navigateToPostDetail}
        >
          {postData.title}
        </h3>
        <div className="category-post-content display-max-3-lines">
          {parse(postData.content ?? '')}
        </div>
        <div>
          <p className="category-post-author">{postData.createdBy}</p>
          <div>
            <span className="category-post-publish-time">
              {postData.publishAt}
            </span>
            {' | '}
            <span className="category-post-read-mins">
              {postData.readingTimeMinutes}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryPost
