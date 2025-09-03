import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, User } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDateForDisplay } from '@/lib/date-utils'
import type { Post } from '../../../.velite'

interface BlogPostCardProps {
  post: Post
  featured?: boolean
}

export function BlogPostCard({ post, featured = false }: BlogPostCardProps) {
  const formattedDate = formatDateForDisplay(post.date)

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${
      featured ? 'border-primary/20 shadow-md' : ''
    }`}>
      {/* Image Section - Clickable */}
      {post.image && (
        <Link href={post.permalink} aria-label={`Read full article: ${post.title}`}>
          <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
            <Image
              src={post.image.src}
              alt={post.image.alt}
              width={400}
              height={192}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 400px"
              loading="lazy"
            />
            {featured && (
              <Badge 
                variant="secondary" 
                className="absolute top-4 left-4 bg-primary text-primary-foreground"
                aria-label="Featured article"
              >
                Featured
              </Badge>
            )}
          </div>
        </Link>
      )}
      
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <time dateTime={post.date}>{formattedDate}</time>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" aria-hidden="true" />
            <span>{post.readingTime} min read</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" aria-hidden="true" />
            <Link 
              href={`/blog/author/${post.author}`} 
              className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
              aria-label={`View articles by ${post.author}`}
            >
              {post.author}
            </Link>
          </div>
        </div>
        
        {/* Title - Clickable */}
        <Link 
          href={post.permalink}
          className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
          aria-label={`Read full article: ${post.title}`}
        >
          <h3 className={`font-bold leading-tight hover:text-primary transition-colors cursor-pointer ${
            featured ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'
          }`}>
            {post.title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className="pt-0">
        {post.description && (
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {post.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {post.categories.map((category) => (
            <Link 
              key={category} 
              href={`/blog/category/${category}`}
              className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
              aria-label={`View articles in ${category} category`}
            >
              <Badge variant="outline" className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                {category}
              </Badge>
            </Link>
          ))}
          {post.tags.slice(0, 3).map((tag) => (
            <Link 
              key={tag} 
              href={`/blog/tag/${tag}`}
              className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
              aria-label={`View articles tagged with ${tag}`}
            >
              <Badge variant="secondary" className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                #{tag}
              </Badge>
            </Link>
          ))}
          {post.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs" aria-label={`${post.tags.length - 3} more tags available`}>
              +{post.tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
