import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, User, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatDateForDisplay } from '@/lib/date-utils'
import type { Post, Author } from '../../../.velite'

interface BlogPostHeaderProps {
  post: Post
  author?: Author
}

export function BlogPostHeader({ post, author }: BlogPostHeaderProps) {
  const formattedDate = formatDateForDisplay(post.date)
  const lastModifiedDate = post.lastModified 
    ? formatDateForDisplay(post.lastModified)
    : null

  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto max-w-screen-2xl section-padding">
        <div className="max-w-4xl mx-auto">
          {/* Categories */}
          {post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category) => (
                <Badge key={category} variant="secondary" className="text-sm">
                  {category}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground break-words">
            {post.title}
          </h1>

          {/* Description */}
          {post.description && (
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
              {post.description}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Published {formattedDate}</span>
            </div>

            {lastModifiedDate && lastModifiedDate !== formattedDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Updated {lastModifiedDate}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readingTime} min read</span>
            </div>

            {author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>By </span>
                <Link href={`/blog/author/${post.author}`} className="hover:text-primary transition-colors font-medium">
                  {author.name}
                </Link>
              </div>
            )}
          </div>

          {/* Featured Image */}
          {post.image && (
            <div className="relative overflow-hidden rounded-lg mb-8">
              <Image
                src={post.image.src}
                alt={post.image.alt}
                width={800}
                height={384}
                className="w-full h-64 md:h-96 object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
