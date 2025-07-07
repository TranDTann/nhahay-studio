import { TPopularPost } from '../types'
import './styles.css'

type TFirstPostProps = {
  post: TPopularPost
}

const FirstPost = ({ post }: TFirstPostProps) => {
  return (
    <div className="first-post-container">
      <div className="first-post-image-container">
        <img
          src={post.photo}
          alt="first-post-image"
          className="first-post-image image-hover-zoom"
        />
      </div>
      <h2 className="first-post-title display-max-3-lines">{post.name}</h2>
      <p className="first-post-description display-max-3-lines">
        {post.content}
      </p>
      <div className="first-post-footer">
        <p>{post.author}</p>
        <p className="first-post-footer_time">
          {post.date} - {post.readMins}
        </p>
      </div>
    </div>
  )
}

export default FirstPost
