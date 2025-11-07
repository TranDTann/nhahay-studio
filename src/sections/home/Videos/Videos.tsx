'use client'

import { useVideoStore } from '@/store/video/videoStore'
import { Flex } from 'antd'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import BlockHeader from '../components/BlockHeader/BlockHeader'
import './styles.scss'
import VideosSkeleton from './VideosSkeleton/VideosSkeleton'

const VideoItem = dynamic(() => import('./VideoItem/VideoItem'), { ssr: false })

const Videos = () => {
  const { videos, getVideos } = useVideoStore()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)

    const fetchData = async () => {
      try {
        await getVideos({ take: 4 })
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [getVideos])

  if (isLoading) {
    return <VideosSkeleton />
  }

  if (!videos.length) return <div>Hiện tại chưa có video nào được tải lên.</div>

  return (
    <div id="Videos">
      <BlockHeader title="Videos" />
      <Flex vertical gap={24}>
        {videos.map((videoItem) => (
          <VideoItem key={videoItem.id} video={videoItem} />
        ))}
      </Flex>
    </div>
  )
}

export default Videos
