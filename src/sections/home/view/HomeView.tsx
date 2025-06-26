'use client'

import CategoriesBlock from '../CategoriesBlock/CategoriesBlock'
import { FeaturedPosts } from '../FeaturedPosts'
import './styles.css'

const HomeView = () => {
  return (
    <div className="home-container">
      <h1>HOME</h1>
      <FeaturedPosts />
      <CategoriesBlock />
    </div>
  )
}

export default HomeView
