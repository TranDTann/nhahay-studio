import paths from '@/routes/paths'
import { Article } from '@/store/article/crud'
import parse from 'html-react-parser'
import { useRouter } from 'next/navigation'
import PostMeta from '../../components/PostMeta/PostMeta'
import './styles.scss'

type TFirstPostProps = {
  post: Article
}

const FirstPost = ({ post }: TFirstPostProps) => {
  const router = useRouter()

  const navigateToPostDetail = () => {
    router.push(paths.dashboard.postDetail({ id: post.id, title: post.title }))
  }

  return (
    <div id="FirstPost">
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
          {parse(post.description ?? '')}
        </p>
        <PostMeta
          author={post?.authorName ?? post.createdByUser.username}
          readingTimeMinutes={post.readingTimeMinutes}
          publishTime={post.publishAt}
        />
      </div>
    </div>
  )
}

export default FirstPost
