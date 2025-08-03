import axios from 'axios'
import Cookies from 'js-cookie'

// Create axios instance with custom config
const axiosInstance = axios.create({
  baseURL: 'https://european-globe-climate-landscapes.trycloudflare.com/',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
  // withCredentials: true
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          // You might want to redirect to login page or refresh token
          break
        case 403:
          // Handle forbidden
          break
        case 404:
          // Handle not found
          break
        default:
          // Handle other errors
          break
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request)
    } else {
      // Error in request configuration
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
