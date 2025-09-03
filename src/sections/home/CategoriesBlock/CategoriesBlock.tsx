import { useCategoriesStore } from '@/store/categories/categoriesStore'
import CategoriesSkeleton from './CategoriesSkeleton/CategoriesSkeleton'
import CategoryCarousel from './CategoryCarousel/CategoryCarousel'
import './styles.css'

const CategoriesBlock = () => {
  const { categories, loading } = useCategoriesStore((state) => state)

  if (loading) {
    return <CategoriesSkeleton />
  }

  return (
    <div className="categories-container">
      <h2 className="categories-block-title">
        Danh mục hàng đầu của chúng tôi
      </h2>
      <div className="categories-list">
        <CategoryCarousel categories={categories} />
      </div>
    </div>
  )
}

export default CategoriesBlock
