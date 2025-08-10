'use client'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Article, articleCrud } from '@/store/article/crud'
import { useCategoriesStore } from '@/store/categories/categoriesStore'
import { App, Button } from 'antd'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import CategoryInfo from '../CategoryInfo/CategoryInfo'
import CategoryPost from '../CategoryPost/CategoryPost'
import CategoryPostFilter from '../CategoryPostFilter/CategoryPostFilter'
import './styles.css'

const CategoryView = () => {
  const pathname = usePathname()
  const { message: messageApi } = App.useApp()

  const {
    categories,
    loading: isGetCategoryLoading,
    getCategories
  } = useCategoriesStore((state) => state)

  const categoryId = pathname.substring(pathname.lastIndexOf('/') + 1)

  const [categoryPosts, setCategoryPosts] = useState<Article[]>([])
  const [isPostsLoading, setIsPostsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPost, setTotalPost] = useState(0)
  const [postType, setPostType] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!categories.length) {
          await getCategories()
        }

        setIsPostsLoading(true)

        const { result = [], count = 0 } = await articleCrud.getArticles({
          categoryId,
          page,
          listType: postType
        })
        setCategoryPosts([...categoryPosts, ...result])
        setTotalPost(count)
      } catch (error) {
        messageApi.error(
          error?.response?.data?.message || 'Lấy danh sách bài viết thất bại!'
        )
      } finally {
        setIsPostsLoading(false)
      }
    }

    fetchData()
  }, [categoryId, page])

  useEffect(() => {
    const fetchCategoryPostsData = async () => {
      try {
        setIsPostsLoading(true)

        const { result = [], count = 0 } = await articleCrud.getArticles({
          categoryId,
          listType: postType
        })
        setCategoryPosts(result)
        setTotalPost(count)
      } catch (error) {
        messageApi.error(
          error?.response?.data?.message || 'Lấy danh sách bài viết thất bại!'
        )
      } finally {
        setIsPostsLoading(false)
      }
    }

    fetchCategoryPostsData()
  }, [postType])

  const categoryView = categories.find((item) => item.id === categoryId)

  if (!categoryView) {
    return null
  }

  let postsContent: ReactNode

  if (isPostsLoading || isGetCategoryLoading) {
    postsContent = (
      <div className="category-details-container_loading">
        <LoadingSpinner />
      </div>
    )
  } else {
    postsContent = (
      <>
        {!categoryPosts.length ? (
          <div className="no-post-notice">
            Danh mục này hiện tại chưa có bài viết nào.
          </div>
        ) : (
          <div className="list-category-post-container">
            {categoryPosts.map((postItem) => (
              <CategoryPost key={postItem.id} postData={postItem} />
            ))}
          </div>
        )}
      </>
    )
  }

  return (
    <div className="category-details-container">
      <CategoryInfo categoryData={categoryView} />
      <CategoryPostFilter setPostType={setPostType} />
      {postsContent}
      {categoryPosts.length < totalPost && (
        <div className="view-more-button-container">
          <Button
            className="view-more-button"
            variant="outlined"
            onClick={() => {
              setPage(page + 1)
            }}
          >
            Xem thêm
          </Button>
        </div>
      )}
    </div>
  )
}

export default CategoryView
