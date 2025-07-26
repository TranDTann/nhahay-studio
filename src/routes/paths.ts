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
    root: () => '/home',
    home: () => '/home',
    category: (categoryName: string) => `/category/${categoryName}`
  },
  admin: {
    root: () => `${roots.admin}`,
    home: () => `${roots.admin}/home`,
    articles: () => `${roots.admin}/articles`,
    article: (id: string) => `${roots.admin}/articles/${id}`,
    categories: () => `${roots.admin}/categories`,
    tags: () => `${roots.admin}/tags`
  }
}

export default paths
