// routes
import paths from '@/routes/paths';

// components
import { DashboardOutlined, FileTextOutlined, TagsOutlined } from '@ant-design/icons';

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
    }
]; 