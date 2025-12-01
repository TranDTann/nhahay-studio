'use client'

import { useVideoStore } from '@/store/video/videoStore'
import { Divider, Flex } from 'antd'
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

  const convertVideoToEmbedUrl = (url: string): string => {
    try {
      const parsed = new URL(url)
      const host = parsed.hostname.replace('www.', '').toLowerCase()

      // 🎬 YouTube
      if (host.includes('youtube.com') || host.includes('youtu.be')) {
        let videoId = ''
        let params = new URLSearchParams()

        if (parsed.hostname === 'youtu.be') {
          videoId = parsed.pathname.slice(1)
        } else if (parsed.pathname.startsWith('/embed/')) {
          return url
        } else {
          videoId = parsed.searchParams.get('v') || ''
          params = parsed.searchParams
        }

        const list = params.get('list')
        const start = params.get('start') || params.get('t')?.replace('s', '')
        let embed = `https://www.youtube.com/embed/${videoId}`
        const extra: string[] = []
        if (list) extra.push(`list=${list}`)
        if (start) extra.push(`start=${start}`)
        if (extra.length) embed += `?${extra.join('&')}`
        return embed
      }

      // 🎥 Vimeo
      if (host.includes('vimeo.com')) {
        const match = parsed.pathname.match(/\/(\d+)/)
        if (match) return `https://player.vimeo.com/video/${match[1]}`
      }

      // 🎞️ Dailymotion
      if (host.includes('dailymotion.com')) {
        const match = parsed.pathname.match(/\/video\/([^_]+)/)
        if (match) return `https://www.dailymotion.com/embed/video/${match[1]}`
      }

      // 📘 Facebook (public video only)
      if (host.includes('facebook.com')) {
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
          url
        )}`
      }

      // 🎵 TikTok
      if (host.includes('tiktok.com')) {
        return `https://www.tiktok.com/embed/${parsed.pathname
          .split('/')
          .pop()}`
      }

      return url
    } catch {
      return url
    }
  }

  if (isLoading) {
    return <VideosSkeleton />
  }

  if (!videos.length) return <div>Hiện tại chưa có video nào được tải lên.</div>

  const convertedVideo = videos.map((item) => ({
    ...item,
    contentListVideo: convertVideoToEmbedUrl(item.contentListVideo)
  }))

  const firstVideo = convertedVideo[0]

  const bottomVideos = convertedVideo.slice(1)

  return (
    <div id="Videos">
      <BlockHeader title="Videos" />
      <div>
        <iframe
          height={260}
          style={{ width: '100%', border: 'none', cursor: 'pointer' }}
          src={firstVideo.contentListVideo}
          title="Video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <h2 className="display-max-3-lines main-video-title">
          {firstVideo.title}
        </h2>
        <Divider />
      </div>
      <Flex vertical gap={24}>
        {bottomVideos.map((videoItem) => (
          <VideoItem key={videoItem.id} video={videoItem} />
        ))}
      </Flex>
    </div>
  )
}

export default Videos
