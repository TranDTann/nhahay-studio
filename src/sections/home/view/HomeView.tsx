'use client'

import CategoriesBlock from '../CategoriesBlock/CategoriesBlock'
import { FeaturedPosts } from '../FeaturedPosts'
import { PopularPosts } from '../PopularPosts'
import './styles.css'

const HomeView = () => {
  return (
    <div className="home-container">
      <FeaturedPosts />
      <CategoriesBlock />
      <PopularPosts />
    </div>
  )
}

export default HomeView
