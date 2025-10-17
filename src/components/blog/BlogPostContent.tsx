import { MDXContent } from '@/components/mdx/MDXContent'
import type { Post } from '../../../.velite'

interface BlogPostContentProps {
  post: Post
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  return (
    <MDXContent code={post.body} />
  )
}
