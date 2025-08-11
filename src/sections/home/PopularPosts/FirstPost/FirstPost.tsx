import paths from '@/routes/paths'
import { Article } from '@/store/article/crud'
import parse from 'html-react-parser'
import { useRouter } from 'next/navigation'
import './styles.css'

type TFirstPostProps = {
  post: Article
}

const FirstPost = ({ post }: TFirstPostProps) => {
  const router = useRouter()

  const navigateToPostDetail = () => {
    router.push(paths.dashboard.postDetail(post.id))
  }

  return (
    <div className="first-post-container">
      <div
        className="first-post-image-container image-hover-zoom-container"
        onClick={navigateToPostDetail}
      >
        <img
          src={post.image}
          alt="first-post-image"
          className="first-post-image image-hover-zoom"
        />
      </div>
      <h2
        className="first-post-title display-max-3-lines"
        onClick={navigateToPostDetail}
      >
        {post.title}
      </h2>
      <p className="first-post-description display-max-3-lines">
        {parse(post.content ?? '')}
      </p>
      <div className="first-post-footer">
        <p>{post.createdBy}</p>
        <p className="first-post-footer_time">
          {post.publishAt} - {post.readingTimeMinutes} mins
        </p>
      </div>
    </div>
  )
}

export default FirstPost
