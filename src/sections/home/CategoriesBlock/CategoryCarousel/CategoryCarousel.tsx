import { Category } from '@/store/categories/crud'
import React from 'react'
import Slider from 'react-slick'
import CategoryItem from '../CategoryItem/CategoryItem'
import './styles.css'

interface Props {
  categories: Category[]
}

const CategoryCarousel: React.FC<Props> = ({ categories }) => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2500
  }

  return (
    <div>
      <Slider {...settings}>
        {categories.map((category) => (
          <div key={category.id}>
            <CategoryItem categoryData={category} />
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default CategoryCarousel
