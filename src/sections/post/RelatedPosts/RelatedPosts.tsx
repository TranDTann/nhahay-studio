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
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2500
  }

  if (!relatedPosts.length) {
    return null
  }

  return (
    <div className="related-post-container">
      <h2 className="related-post-title">Những bài viết liên quan</h2>
      <Slider {...settings}>
        {relatedPosts.map((postItem) => (
          <div key={postItem.id}>
            <RelatedPostItem postData={postItem} />
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default RelatedPosts
