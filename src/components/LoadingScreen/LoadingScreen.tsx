import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import './styles.css'

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <Spin
        indicator={
          <LoadingOutlined className="loading-icon color-primary" spin />
        }
      />
    </div>
  )
}

export default LoadingScreen
