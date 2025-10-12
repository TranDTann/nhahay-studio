import { useAdvertisementStore } from '@/store/advertisement/advertisementStore'
import Link from 'next/link'
import { useEffect } from 'react'
import './styles.css'

const Advertising = () => {
  const { getAdvertisements, advertisements } = useAdvertisementStore()

  useEffect(() => {
    if (advertisements?.length) {
      return
    }

    const fetchData = async () => {
      try {
        await getAdvertisements()
      } catch (error) {
        // Error is already handled in the store
      }
    }
    fetchData()
  }, [getAdvertisements])

  if (!advertisements?.length) {
    return null
  }

  const advertisementView = advertisements[1]

  return (
    <div className="advertising-image-container image-hover-zoom-container">
      <Link href={advertisementView.link} target="_blank">
        <img
          src={advertisementView.imageUrl}
          alt="anh-quang-cao"
          className="advertising-image image-hover-zoom"
        />
      </Link>
    </div>
  )
}

export default Advertising
