export const formatDateDisplay = (date: Date | string): string => {
  const inputDate = new Date(date)
  const now = new Date()

  const diffTime = now.getTime() - inputDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 30) {
    if (diffDays <= 0) {
      return 'Hôm nay'
    }
    return `${diffDays} ngày trước`
  }

  return inputDate.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
