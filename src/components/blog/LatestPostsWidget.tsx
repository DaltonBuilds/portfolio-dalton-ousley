import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { posts } from '../../../.velite'

interface LatestPostsWidgetProps {
  maxPosts?: number
  showFeatured?: boolean
  title?: string
  className?: string
}

export function LatestPostsWidget({ 
  maxPosts = 6, 
  showFeatured = true,
  title = "DevOps Projects & Insights",
  className = ""
}: LatestPostsWidgetProps) {
  // Get published posts sorted by date
  const publishedPosts = posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Get the most recent featured post to highlight
  const featuredPost = showFeatured 
    ? publishedPosts.find((post) => post.featured)
    : null

  // Get the remaining posts (excluding the featured one if showing featured)
  const remainingPosts = featuredPost
    ? publishedPosts.filter((post) => post.slug !== featuredPost.slug).slice(0, maxPosts - 1)
    : publishedPosts.slice(0, maxPosts)

  const displayPosts = featuredPost 
    ? [featuredPost, ...remainingPosts]
    : remainingPosts

  if (displayPosts.length === 0) {
    return null
  }

  return (
    <section className={`py-12 sm:py-16 ${className}`}>
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h2>
          <Button variant="outline" asChild className="shrink-0 self-start sm:self-auto">
            <Link href="/blog" className="flex items-center gap-2">
              <span className="hidden sm:inline">View All Posts</span>
              <span className="sm:hidden">View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {displayPosts.map((post, index) => {
            const isFeatured = featuredPost && post.slug === featuredPost.slug
            const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })

            return (
              <Card 
                key={post.slug} 
                className="group hover:shadow-lg transition-all duration-300 flex flex-col border-border/20"
              >
                <Link href={post.permalink} className="flex flex-col h-full">
                  {post.image && (
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={post.image.src}
                        alt={post.image.alt}
                        width={400}
                        height={200}
                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                      />
                      {isFeatured && (
                        <Badge 
                          variant="secondary" 
                          className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs"
                        >
                          Featured
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formattedDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingTime} min
                      </div>
                    </div>
                    
                    <CardTitle className="group-hover:text-primary transition-colors line-clamp-2 text-base sm:text-lg">
                      {post.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-4 sm:p-6 pt-0 flex-1 flex flex-col">
                    {post.description && (
                      <p className="text-muted-foreground mb-4 line-clamp-2 flex-1">
                        {post.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {post.categories.slice(0, 1).map((category) => (
                        <Badge key={category} variant="outline" className="text-xs px-2 py-1">
                          {category}
                        </Badge>
                      ))}
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs px-2 py-1">
                          #{tag}
                        </Badge>
                      ))}
                      {(post.categories.length > 1 || post.tags.length > 2) && (
                        <Badge variant="secondary" className="text-xs px-2 py-1">
                          +more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
