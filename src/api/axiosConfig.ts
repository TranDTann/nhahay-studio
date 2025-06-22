import axios from 'axios'

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
    // You can add auth token here if needed
    const token = localStorage.getItem('token')
    if (token) {
      //   config.headers.Authorization = `Bearer ${token}`
    }
    config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJjNmVkNDUwYy1mNWNmLTQ1YjAtNDBlNy0wOGRkYWRhZThhZTYiLCJlbWFpbCI6ImdpYW5nQGV4YW1wbGUuY29tIiwiZ2l2ZW5fbmFtZSI6ImdpYW5nYWRtaW4iLCJyb2xlIjoiQWRtaW4iLCJuYmYiOjE3NTAyNjMwMjMsImV4cCI6MTc1MDg2NzgyMywiaWF0IjoxNzUwMjYzMDIzLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3Mjg5IiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIn0.mIu41tDXxBRDFOgUT_Umm3Z3Jq7uwHl3xuqPg2Nzn7c`
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
