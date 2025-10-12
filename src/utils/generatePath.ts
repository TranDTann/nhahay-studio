import slugify from 'slugify'

export function generateDetailPath({
  page,
  title,
  id
}: {
  page: string
  title: string
  id: string
}) {
  if (!title || !id) return ''

  const slug = slugify(title, {
    lower: true,
    strict: true,
    locale: 'vi'
  })

  return `/${page}/${slug}--${id}.html`
}

export function getIdFromPathname(pathname) {
  if (!pathname) return null

  const lastSegment = pathname.split('/').pop()?.replace('.html', '') || ''

  const parts = lastSegment.split('--')
  return parts.length > 1 ? parts[1] : null
}
