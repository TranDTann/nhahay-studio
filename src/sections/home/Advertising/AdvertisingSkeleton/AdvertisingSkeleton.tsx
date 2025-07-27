import { Skeleton } from 'antd'
import './AdvertisingSkeleton.css'

const AdvertisingSkeleton = () => {
  return (
    <div className="advertising-skeleton-container">
      <Skeleton.Node active />
    </div>
  )
}

export default AdvertisingSkeleton
