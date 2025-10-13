'use client'

import { PostTypeEnum } from '@/store/article/articleStore'
import { Article, articleCrud } from '@/store/article/crud'
import { useEffect, useState } from 'react'
import Slider from 'react-slick'
import RelatedPostItem from './RelatedPostItem/RelatedPostItem'
import './styles.css'

type TRelatedPostsProps = {
  postData: Article
}

const RelatedPosts = ({ postData }: TRelatedPostsProps) => {
  const [relatedPosts, setRelatedPosts] = useState<Article[]>([])

  const handleSlidesToShow = (width = window.innerWidth) => {
    if (width < 768) return 1 // Mobile
    if (width < 1024) return 2 // Tablet
    if (width < 1536) return 3 // Laptop
    return 4 // Desktop
  }
  useEffect(() => {
    const fetchRelatedPosts = async () => {
      const { result = [] } = await articleCrud.getArticles({
        listType: PostTypeEnum.RELATED_POSTS,
        categoryId: postData?.category?.id,
        // tags: postData?.tags?.map((item) => item.id) ?? [],
        isPublished: true
      })

      setRelatedPosts(result)
    }

    fetchRelatedPosts()
  }, [postData.category])

  const settings = {
    infinite: true,
    speed: 750,
    slidesToShow: handleSlidesToShow(),
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2500
  }

  if (!relatedPosts.length) {
    return null
  }

  return (
    <div>
      <h2 className="related-post-title">Những bài viết liên quan</h2>
      <div className="related-post-container">
        <Slider {...settings}>
          {relatedPosts.map((postItem) => (
            <div key={postItem.id}>
              <RelatedPostItem postData={postItem} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default RelatedPosts
