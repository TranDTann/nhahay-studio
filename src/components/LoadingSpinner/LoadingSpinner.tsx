import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import './styles.css'

const LoadingSpinner = () => {
  return (
    <Spin
      indicator={
        <LoadingOutlined className="loading-icon color-primary" spin />
      }
    />
  )
}

export default LoadingSpinner
