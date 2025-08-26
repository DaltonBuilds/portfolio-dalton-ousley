import { MDXContent } from '@/components/mdx/MDXContent'
import type { Post } from '../../../.velite'

interface BlogPostContentProps {
  post: Post
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <MDXContent code={post.body} />
    </div>
  )
}
