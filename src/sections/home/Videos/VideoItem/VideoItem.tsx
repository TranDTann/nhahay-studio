import { Video } from '@/store/video/crud'
import { Col, Row } from 'antd'
import './styles.scss'

type TVideoItemProps = {
  video: Video
}

const VideoItem = ({ video }: TVideoItemProps) => {
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

  return (
    <div id="VideoItem">
      <Row
        gutter={{
          xs: 16,
          md: 24
        }}
      >
        <Col xs={12} md={14}>
          <iframe
            height={140}
            style={{ width: '100%', border: 'none', cursor: 'pointer' }}
            src={convertVideoToEmbedUrl(video.contentListVideo)}
            title="Video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Col>
        <Col xs={12} md={10}>
          <h3
            className="video-title display-max-3-lines"
            onClick={() => window.open(video.contentListVideo, '_blank')}
          >
            {video.title}
          </h3>
        </Col>
      </Row>
    </div>
  )
}

export default VideoItem
