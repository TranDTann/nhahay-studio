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
import { Col, Row } from 'antd'

const FeaturedPosts = lazy(() => import('../FeaturedPosts'))
const SubFeaturedPost = lazy(
  () => import('../FeaturedPosts/SubFeaturedPost/SubFeaturedPost')
)
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
        minHeight={400}
        fallback={<FeaturedPostsSkeleton />}
      />
      <Row gutter={[24, 24]} className="featured-posts-container">
        <Col xs={24} md={24} lg={8} className="main-post-container">
          <LazyLoadBlock
            Component={PopularPosts}
            minHeight={450}
            fallback={<PopularPostsSkeleton />}
          />
        </Col>
        <Col xs={24} md={24} lg={8} className="right-posts-wrapper">
          <LazyLoadBlock
            Component={SubFeaturedPost}
            minHeight={450}
            fallback={<></>}
          />
        </Col>
        <Col xs={24} md={24} lg={8} className="right-posts-wrapper">
          <LazyLoadBlock
            Component={TrendingPosts}
            minHeight={450}
            fallback={<TrendingPostsSkeleton />}
          />
        </Col>
      </Row>
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
      {/* <LazyLoadBlock
        Component={CategoriesBlock}
        minHeight={200}
        fallback={<CategoriesSkeleton />}
      /> */}
    </div>
  )
}

export default HomeView
