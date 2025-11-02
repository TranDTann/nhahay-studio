'use client'

import paths from '@/routes/paths'
import { Article } from '@/store/article/crud'
import { useRouter } from 'next/navigation'
import CategoryTag from '../../components/CategoryTag/CategoryTag'
import PostMeta from '../../components/PostMeta/PostMeta'
import './styles.scss'
import { useFeaturedPostStore } from '@/store/featuredPost/FeaturedPostStore'

type TSubFeaturedPostProps = {
  postData?: Article
}

const SubFeaturedPost = ({ postData }: TSubFeaturedPostProps) => {
  const router = useRouter()

  const { featuredPosts } = useFeaturedPostStore((state) => state)

  const subPost = featuredPosts?.[2]

  let postView: Article

  if (postData) {
    postView = postData
  } else {
    postView = subPost
  }

  if (!postView) {
    return
  }

  const navigateToPostDetail = () => {
    router.push(
      paths.dashboard.postDetail({ id: postView.id, title: postView.title })
    )
  }

  return (
    <div id="SubFeaturedPost">
      <div
        className="sub-featured-post-container image-hover-zoom-container"
        onClick={navigateToPostDetail}
      >
        <div className="sub-featured-post-image-container background-img--scrim-bottom">
          <img
            src={postView.image}
            alt="FeaturedPost-image"
            className="sub-featured-post-image image-hover-zoom"
          />
        </div>
        <div className="sub-featured-post-content">
          <CategoryTag tagName={postView.category?.name} />
          <h3 className="sub-featured-post-title display-max-2-lines">
            {postView.title}
          </h3>
          <PostMeta
            author={postView?.authorName ?? postView?.createdByUser?.username}
            publishTime={postView.publishAt}
          />
        </div>
      </div>
    </div>
  )
}

export default SubFeaturedPost
