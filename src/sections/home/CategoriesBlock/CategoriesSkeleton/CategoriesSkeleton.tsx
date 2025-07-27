import { Skeleton } from 'antd'
import '../styles.css'
import './CategoriesSkeleton.css'

const CategoriesSkeleton = () => {
  return (
    <div className="categories-container">
      <div className="categories-skeleton_header">
        <Skeleton.Input active size="default" />
      </div>
      <div className="categories-list">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index}>
            <Skeleton.Avatar active size={100} shape="circle" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoriesSkeleton
