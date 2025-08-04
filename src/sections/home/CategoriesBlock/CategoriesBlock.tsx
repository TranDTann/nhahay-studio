import { useCategoriesStore } from '@/store/categories/categoriesStore'
import CategoriesSkeleton from './CategoriesSkeleton/CategoriesSkeleton'
import CategoryItem from './CategoryItem/CategoryItem'
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
        {categories.map((category) => (
          <CategoryItem key={category.id} categoryData={category} />
        ))}
      </div>
    </div>
  )
}

export default CategoriesBlock
