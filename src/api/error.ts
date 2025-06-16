export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export const handleApiError = (error: any): never => {
  if (error.response) {
    throw new ApiError(
      error.response.data?.message || 'An error occurred',
      error.response.status
    )
  }
  throw new ApiError(error.message || 'An unexpected error occurred')
}
