'use client'

import CategoriesBlock from '../CategoriesBlock/CategoriesBlock'
import { FeaturedPosts } from '../FeaturedPosts'
import { PopularPosts } from '../PopularPosts'
import RecentPosts from '../RecentPosts/RecentPosts'
import { Advertising } from '../Advertising'
import './styles.css'
import { TrendingPosts } from '../TrendingPosts'

const HomeView = () => {
  return (
    <div className="home-container">
      <FeaturedPosts />
      <CategoriesBlock />
      <PopularPosts />
      <RecentPosts />
      <Advertising />
      <TrendingPosts />
    </div>
  )
}

export default HomeView
