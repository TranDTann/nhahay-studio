import { useCategoriesStore } from '@/store/categories/categoriesStore'
import CategoriesSkeleton from './CategoriesSkeleton/CategoriesSkeleton'
import CategoryCarousel from './CategoryCarousel/CategoryCarousel'
import './styles.scss'

const CategoriesBlock = () => {
  const { categories, loading } = useCategoriesStore((state) => state)

  if (loading) {
    return <CategoriesSkeleton />
  }

  return (
    <div id="CategoriesBlock">
      <div className="categories-container">
        <h2 className="categories-block-title">Danh mục khác</h2>
        <div className="categories-list">
          <CategoryCarousel categories={categories} />
        </div>
      </div>
    </div>
  )
}

export default CategoriesBlock
