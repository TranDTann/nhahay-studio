const roots = {
  auth: "/auth",
  dashboard: "/dashboard",
};

const paths = {
  auth: {
    root: roots.auth,
    login: `${roots.auth}/login`,
    signup: `${roots.auth}/sign-up`,
  },
  dashboard: {
    root: () => "/home",
    home: () => "/home",
  },
};

export default paths;
