'use client'

import CategoriesBlock from '../CategoriesBlock/CategoriesBlock'
import { FeaturedPosts } from '../FeaturedPosts'
import './styles.css'

const HomeView = () => {
  return (
    <div className="home-container">
      <FeaturedPosts />
      <CategoriesBlock />
    </div>
  )
}

export default HomeView
