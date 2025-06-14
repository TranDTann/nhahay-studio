'use client';

import { use } from 'react';
import FormBlog from '@/sections/admin/articles/FormBlog';

export default function ArticlePage({ params }: { params: { id: string } }) {
    return <FormBlog id={params.id} />;
} 