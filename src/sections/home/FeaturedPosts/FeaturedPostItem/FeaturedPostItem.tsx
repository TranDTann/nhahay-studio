'use client'

import paths from '@/routes/paths'
import { Article } from '@/store/article/crud'
import { useRouter } from 'next/navigation'
import { MdOutlineDateRange } from 'react-icons/md'
import CategoryTag from '../../components/CategoryTag/CategoryTag'
import './styles.css'

type TFeaturedPostItemProps = {
  postData: Article
}

const FeaturedPostItem = ({ postData }: TFeaturedPostItemProps) => {
  const router = useRouter()

  return (
    <div
      className="featured-post-item-container image-hover-zoom-container"
      onClick={() => router.push(paths.dashboard.postDetail(postData.id))}
    >
      <div className="featured-post-item-image-container">
        <img
          src={postData.image}
          alt="FeaturedPost-image"
          className="featured-post-item-image image-hover-zoom"
        />
      </div>
      <div className="featured-post-item-content">
        <CategoryTag tagName={postData.category?.name} />
        <h3 className="featured-post-item-title display-max-2-lines">
          {postData.title}
        </h3>
        <div className="featured-post-item-date">
          <MdOutlineDateRange color="#bacce1" /> <p>{postData.publishAt}</p>
        </div>
      </div>
    </div>
  )
}

export default FeaturedPostItem
