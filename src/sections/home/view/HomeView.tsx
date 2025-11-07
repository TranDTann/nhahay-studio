'use client'

import { LazyLoadBlock } from '@/components/LazyLoadBlock'
import { Col, Row } from 'antd'
import { lazy } from 'react'
import AdvertisingSkeleton from '../Advertising/AdvertisingSkeleton/AdvertisingSkeleton'
import FeaturedPostsSkeleton from '../FeaturedPosts/FeaturedPostsSkeleton/FeaturedPostsSkeleton'
import SubFeaturedPostsSkeleton from '../FeaturedPosts/SubFeaturedPost/SubFeaturedPostsSkeleton/SubFeaturedPostsSkeleton'
import PopularPostsSkeleton from '../PopularPosts/PopularPostsSkeleton/PopularPostsSkeleton'
import RecentPostsSkeleton from '../RecentPosts/RecentPostsSkeleton/RecentPostsSkeleton'
import VideosSkeleton from '../Videos/VideosSkeleton/VideosSkeleton'
import TrendingPostsSkeleton from '../TrendingPosts/TrendingPostsSkeleton/TrendingPostsSkeleton'
import './styles.scss'

const FeaturedPosts = lazy(() => import('../FeaturedPosts'))
const SubFeaturedPost = lazy(
  () => import('../FeaturedPosts/SubFeaturedPost/SubFeaturedPost')
)
const CategoriesBlock = lazy(() => import('../CategoriesBlock'))
const PopularPosts = lazy(() => import('../PopularPosts'))
const RecentPosts = lazy(() => import('../RecentPosts'))
const Videos = lazy(() => import('../Videos'))
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
      <Row gutter={[24, 24]}>
        <Col xs={24} md={24} lg={8}>
          <LazyLoadBlock
            Component={PopularPosts}
            minHeight={300}
            fallback={<PopularPostsSkeleton />}
          />
        </Col>
        <Col xs={24} md={24} lg={8} className="sub-featured-post">
          <LazyLoadBlock
            Component={SubFeaturedPost}
            minHeight={240}
            fallback={<SubFeaturedPostsSkeleton />}
          />
        </Col>
        <Col xs={24} md={24} lg={8} className="right-posts-wrapper">
          <LazyLoadBlock
            Component={TrendingPosts}
            minHeight={300}
            fallback={<TrendingPostsSkeleton />}
          />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={14} lg={16}>
          <LazyLoadBlock
            Component={RecentPosts}
            minHeight={500}
            fallback={<RecentPostsSkeleton />}
          />
        </Col>
        <Col xs={24} sm={24} md={10} lg={8}>
          <LazyLoadBlock
            Component={Videos}
            minHeight={500}
            fallback={<VideosSkeleton />}
          />
        </Col>
      </Row>
      <LazyLoadBlock
        Component={Advertising}
        minHeight={240}
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
