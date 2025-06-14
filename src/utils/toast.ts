import { message } from 'antd'

export const showToast = {
  success: (content: string) => {
    message.success({
      content,
      duration: 3,
      style: {
        marginTop: '20px'
      }
    })
  },
  error: (content: string) => {
    message.error({
      content,
      duration: 5,
      style: {
        marginTop: '20px'
      }
    })
  },
  warning: (content: string) => {
    message.warning({
      content,
      duration: 4,
      style: {
        marginTop: '20px'
      }
    })
  }
}
