'use client'

import ArticleRenderer from '@/components/ArticleRenderer'
import './styles.css'

type TPostDetailContentProps = {
  postContent: string
}

const PostDetailContent = ({ postContent }: TPostDetailContentProps) => {
  return <ArticleRenderer content={postContent} />
}

export default PostDetailContent
