import { Video } from '@/store/video/crud'
import { Col, Row } from 'antd'
import './styles.scss'

type TVideoItemProps = {
  video: Video
}

const VideoItem = ({ video }: TVideoItemProps) => {
  return (
    <div id="VideoItem">
      <Row
        gutter={{
          xs: 16,
          sm: 16,
          lg: 16,
          md: 24
        }}
      >
        <Col xs={12} md={14}>
          <iframe
            height={140}
            style={{ width: '100%', border: 'none', cursor: 'pointer' }}
            src={video.contentListVideo}
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
