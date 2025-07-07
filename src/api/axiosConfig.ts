import axios from 'axios'
import Cookies from 'js-cookie'

// Create axios instance with custom config
const axiosInstance = axios.create({
  baseURL: 'https://lemur-gentle-cricket.ngrok-free.app',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      //   config.headers.Authorization = `Bearer ${token}`
    }
    config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxMTgyZjllNy1mY2IwLTQyNmEtNTIyYy0wOGRkYjk3NTZmNjkiLCJlbWFpbCI6ImdpYW5nQGV4YW1wbGUuY29tIiwiZ2l2ZW5fbmFtZSI6ImdpYW5nYWRtaW4iLCJyb2xlIjoiQWRtaW4iLCJuYmYiOjE3NTE0NjkxMzcsImV4cCI6MTc1MjA3MzkzNywiaWF0IjoxNzUxNDY5MTM3LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3Mjg5IiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIn0.PeD2kJy4m_pU0WoJsaMA2VYXGSEuhr9wdMrjV3eW2CY`
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
