import { generateDetailPath } from '@/utils/generatePath'

type TPageParams = { title: string; id: string }

const roots = {
  auth: '/auth',
  dashboard: '/dashboard',
  admin: '/admin'
}

const paths = {
  auth: {
    root: roots.auth,
    login: `${roots.auth}/login`,
    signup: `${roots.auth}/sign-up`,
    admin: `${roots.auth}/admin`
  },
  dashboard: {
    root: () => '/',
    home: () => '/home',
    category: ({ id, title }: TPageParams) =>
      generateDetailPath({ id, title, page: 'category' }),
    postDetail: ({ id, title }: TPageParams) =>
      generateDetailPath({ id, title, page: 'post' })
  },
  admin: {
    root: () => `${roots.admin}`,
    home: () => `${roots.admin}/home`,
    articles: () => `${roots.admin}/articles`,
    article: (id: string) => `${roots.admin}/articles/${id}`,
    articleView: (id: string) => `${roots.admin}/articles/view/${id}`,
    categories: () => `${roots.admin}/categories`,
    tags: () => `${roots.admin}/tags`,
    advertisements: () => `${roots.admin}/advertisements`,
    banners: () => `${roots.admin}/banners`
  }
}

export default paths
