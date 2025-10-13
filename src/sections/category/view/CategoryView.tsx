'use client'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { articleCrud } from '@/store/article/crud'
import { useCategoriesStore } from '@/store/categories/categoriesStore'
import {
  EViewMode,
  useCategoryPostsStore
} from '@/store/categoryPosts/categoryPostStore'
import { getIdFromPathname } from '@/utils/generatePath'
import { App, Button } from 'antd'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import CategoryInfo from '../CategoryInfo/CategoryInfo'
import CategoryPost from '../CategoryPost/CategoryPost'
import CategoryPostFilter from '../CategoryPostFilter/CategoryPostFilter'
import CategoryPostTabs from '../CategoryPostTabs/CategoryPostTabs'
import CategoryViewGrid from './CategoryViewGrid'
import './styles.scss'

const CategoryView = () => {
  const pathname = usePathname()
  const { message: messageApi } = App.useApp()

  const categoryId = getIdFromPathname(pathname)

  const [isPostsLoading, setIsPostsLoading] = useState(false)

  const {
    categories,
    loading: isGetCategoryLoading,
    getCategories
  } = useCategoriesStore((state) => state)
  const { categoryPosts, total, currentPage, viewMode, filters } =
    useCategoryPostsStore((state) => state)

  const fetchArticles = async (params: {
    categoryId: string
    search?: string
    page?: number
    listType?: number
    isPublished?: boolean
    append?: boolean
  }) => {
    try {
      setIsPostsLoading(true)

      const { result = [], count = 0 } = await articleCrud.getArticles({
        categoryId: params.categoryId,
        search: params.search,
        page: params.page,
        listType: params.listType,
        isPublished: params.isPublished
      })

      useCategoryPostsStore.setState((prev) => ({
        categoryPosts: params.append
          ? [...prev.categoryPosts, ...result]
          : result,
        total: count
      }))
    } catch (error) {
      messageApi.error(
        error?.response?.data?.message || 'Lấy danh sách bài viết thất bại!'
      )
    } finally {
      setIsPostsLoading(false)
    }
  }

  useEffect(() => {
    if (!categories.length) {
      getCategories()
    }

    fetchArticles({
      categoryId,
      page: currentPage,
      listType: filters.listType,
      isPublished: filters.isPublished,
      append: true
    })
  }, [categoryId, currentPage])

  useEffect(() => {
    fetchArticles({
      categoryId,
      search: filters.search,
      listType: filters.listType,
      isPublished: filters.isPublished,
      append: false
    })
  }, [filters.listType, filters.search])

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
          <>
            {viewMode === EViewMode.LIST ? (
              <div className="list-category-post-container">
                {categoryPosts.map((postItem) => (
                  <CategoryPost key={postItem.id} postData={postItem} />
                ))}
              </div>
            ) : (
              <CategoryViewGrid categoryPosts={categoryPosts} />
            )}
          </>
        )}
      </>
    )
  }

  return (
    <div id="CategoryView">
      <div className="category-details-controller-wrapper">
        <div className="category-details-controller">
          <CategoryInfo categoryData={categoryView} />
          <CategoryPostTabs />
        </div>
      </div>
      <div className="category-details-content">
        <CategoryPostFilter />
        {postsContent}
        {categoryPosts.length < total && (
          <div className="view-more-button-container">
            <Button
              className="view-more-button"
              variant="outlined"
              onClick={() => {
                useCategoryPostsStore.setState({ currentPage: currentPage + 1 })
              }}
            >
              Xem thêm
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryView
