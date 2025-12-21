'use client'

import paths from '@/routes/paths'
import { Article } from '@/store/article/crud'
import { useFeaturedPostStore } from '@/store/featuredPost/featuredPostStore'
import { useRouter } from 'next/navigation'
import CategoryTag from '../../components/CategoryTag/CategoryTag'
import PostMeta from '../../components/PostMeta/PostMeta'
import './styles.scss'
import SubFeaturedPostsSkeleton from './SubFeaturedPostsSkeleton/SubFeaturedPostsSkeleton'

type TSubFeaturedPostProps = {
  postData?: Article
}

const SubFeaturedPost = ({ postData }: TSubFeaturedPostProps) => {
  const router = useRouter()

  const { featuredPosts, isLoading } = useFeaturedPostStore((state) => state)

  if (isLoading && !postData) {
    return <SubFeaturedPostsSkeleton />
  }

  const subsPost = featuredPosts?.slice(2, 4)?.filter(Boolean)

  let postsView: Article[]

  if (postData) {
    postsView = [postData]
  } else {
    postsView = [...subsPost]
  }

  if (!postsView?.length) {
    return
  }

  const isSubPotsLv2 = !postData

  const navigateToPostDetail = (id: string, title: string) => {
    router.push(paths.dashboard.postDetail({ id, title }))
  }

  return (
    <div id="SubFeaturedPost">
      {postsView.map((item, index) => (
        <div
          key={index}
          style={{ marginTop: index === 1 ? 24 : 0 }}
          className="sub-featured-post-container image-hover-zoom-container"
          onClick={() => navigateToPostDetail(item.id, item.title)}
        >
          <div className="sub-featured-post-image-container background-img--scrim-bottom">
            <img
              src={item.image}
              alt="FeaturedPost-image"
              className={`sub-featured-post-image image-hover-zoom ${
                isSubPotsLv2 && 'sub-featured-post-image-lv2'
              }`}
            />
          </div>
          <div className="sub-featured-post-content">
            <CategoryTag tagName={item.category?.name} />
            <h3 className="sub-featured-post-title display-max-3-lines">
              {item.title}
            </h3>
            <PostMeta
              author={item?.authorName ?? item?.createdByUser?.username}
              publishTime={item.publishAt}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default SubFeaturedPost
