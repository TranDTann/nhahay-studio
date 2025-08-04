'use client'

import { LazyLoadBlock } from '@/components/LazyLoadBlock'
import { lazy } from 'react'
import AdvertisingSkeleton from '../Advertising/AdvertisingSkeleton/AdvertisingSkeleton'
import CategoriesSkeleton from '../CategoriesBlock/CategoriesSkeleton/CategoriesSkeleton'
import FeaturedPostsSkeleton from '../FeaturedPosts/FeaturedPostsSkeleton/FeaturedPostsSkeleton'
import PopularPostsSkeleton from '../PopularPosts/PopularPostsSkeleton/PopularPostsSkeleton'
import RecentPostsSkeleton from '../RecentPosts/RecentPostsSkeleton/RecentPostsSkeleton'
import TrendingPostsSkeleton from '../TrendingPosts/TrendingPostsSkeleton/TrendingPostsSkeleton'
import './styles.css'

const FeaturedPosts = lazy(() => import('../FeaturedPosts'))
const CategoriesBlock = lazy(() => import('../CategoriesBlock'))
const PopularPosts = lazy(() => import('../PopularPosts'))
const RecentPosts = lazy(() => import('../RecentPosts'))
const Advertising = lazy(() => import('../Advertising'))
const TrendingPosts = lazy(() => import('../TrendingPosts'))

const HomeView = () => {
  return (
    <div className="home-container">
      <LazyLoadBlock
        Component={FeaturedPosts}
        minHeight={500}
        fallback={<FeaturedPostsSkeleton />}
      />
      <LazyLoadBlock
        Component={CategoriesBlock}
        minHeight={250}
        fallback={<CategoriesSkeleton />}
      />
      <LazyLoadBlock
        Component={PopularPosts}
        minHeight={450}
        fallback={<PopularPostsSkeleton />}
      />
      <LazyLoadBlock
        Component={RecentPosts}
        minHeight={500}
        fallback={<RecentPostsSkeleton />}
      />
      <LazyLoadBlock
        Component={Advertising}
        minHeight={300}
        fallback={<AdvertisingSkeleton />}
      />
      <LazyLoadBlock
        Component={TrendingPosts}
        minHeight={725}
        fallback={<TrendingPostsSkeleton />}
      />
    </div>
  )
}

export default HomeView
