'use client'

import paths from '@/routes/paths'
import PostMeta from '@/sections/home/components/PostMeta/PostMeta'
import { Article } from '@/store/article/crud'
import { useRouter } from 'next/navigation'
import './styles.css'

type TRelatedPostItemProps = {
  postData: Article
}

const RelatedPostItem = ({ postData }: TRelatedPostItemProps) => {
  const router = useRouter()

  const navigateToPostDetail = () => {
    router.push(
      paths.dashboard.postDetail({ id: postData.id, title: postData.title })
    )
  }
  return (
    <div className="related-post-item-container">
      <div
        className="related-post-item-image-container image-hover-zoom-container"
        onClick={navigateToPostDetail}
      >
        <img
          src={postData.image}
          alt="RelatedPost-image"
          className="related-post-item-image image-hover-zoom"
        />
      </div>
      <div className="related-post-item-content">
        <h3
          className="related-post-item-title display-max-2-lines"
          onClick={navigateToPostDetail}
        >
          {postData.title}
        </h3>
        <PostMeta
          author={postData?.authorName ?? postData.createdByUser.username}
        />
        <PostMeta publishTime={postData.publishAt} />
      </div>
    </div>
  )
}

export default RelatedPostItem
