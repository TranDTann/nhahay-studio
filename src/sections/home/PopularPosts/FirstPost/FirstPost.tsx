import { Article } from '@/store/article/crud'
import './styles.css'

type TFirstPostProps = {
  post: Article
}

const FirstPost = ({ post }: TFirstPostProps) => {
  return (
    <div className="first-post-container">
      <div className="first-post-image-container">
        <img
          src={post.image}
          alt="first-post-image"
          className="first-post-image image-hover-zoom"
        />
      </div>
      <h2 className="first-post-title display-max-3-lines">{post.title}</h2>
      <p className="first-post-description display-max-3-lines">
        {post.content}
      </p>
      <div className="first-post-footer">
        <p>{post.createdBy}</p>
        <p className="first-post-footer_time">
          {post.publishAt} - {post.ratingAvg}
        </p>
      </div>
    </div>
  )
}

export default FirstPost
