// routes
import paths from '@/routes/paths';

// components
import { DashboardOutlined, FileTextOutlined, TagsOutlined, PictureOutlined } from '@ant-design/icons';

// ----------------------------------------------------------------------

export const navConfig = [
    {
        title: 'Dashboard',
        path: paths.admin.root(),
        icon: <DashboardOutlined />,
    },
    {
        title: 'Articles',
        path: paths.admin.articles(),
        icon: <FileTextOutlined />,
    },
    {
        title: 'Categories',
        path: paths.admin.categories(),
        icon: <TagsOutlined />,
    },
    {
        title: 'Tags',
        path: paths.admin.tags(),
        icon: <TagsOutlined />,
    },
    {
        title: 'Advertisements',
        path: paths.admin.advertisements(),
        icon: <PictureOutlined />,
    },
    {
        title: 'Banners',
        path: paths.admin.banners(),
        icon: <PictureOutlined />,
    }
]; 