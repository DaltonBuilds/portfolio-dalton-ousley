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
  maxPosts = 3, 
  showFeatured = true,
  title = "Latest Blog Posts",
  className = ""
}: LatestPostsWidgetProps) {
  // Get published posts
  const publishedPosts = posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Get featured posts if requested
  const featuredPosts = showFeatured 
    ? publishedPosts.filter((post) => post.featured).slice(0, 1)
    : []

  // Get latest posts (excluding featured if showing featured)
  const latestPosts = showFeatured
    ? publishedPosts.filter((post) => !post.featured).slice(0, maxPosts - featuredPosts.length)
    : publishedPosts.slice(0, maxPosts)

  const displayPosts = [...featuredPosts, ...latestPosts]

  if (displayPosts.length === 0) {
    return null
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto max-w-6xl px-6 md:px-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
          <Button variant="outline" asChild>
            <Link href="/blog" className="flex items-center gap-2">
              View All Posts
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPosts.map((post) => {
            const isFeatured = featuredPosts.includes(post)
            const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })

            return (
              <Card 
                key={post.slug} 
                className={`group hover:shadow-lg transition-all duration-300 ${
                  isFeatured ? 'md:col-span-2 lg:col-span-2 border-primary/20' : ''
                }`}
              >
                <Link href={post.permalink}>
                  {post.image && (
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={post.image.src}
                        alt={post.image.alt}
                        width={400}
                        height={isFeatured ? 192 : 128}
                        className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                          isFeatured ? 'h-48' : 'h-32'
                        }`}
                      />
                      {isFeatured && (
                        <Badge 
                          variant="secondary" 
                          className="absolute top-4 left-4 bg-primary text-primary-foreground"
                        >
                          Featured
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formattedDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingTime} min
                      </div>
                    </div>
                    
                    <CardTitle className={`group-hover:text-primary transition-colors line-clamp-2 ${
                      isFeatured ? 'text-xl' : 'text-lg'
                    }`}>
                      {post.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {post.description && (
                      <p className={`text-muted-foreground mb-4 ${
                        isFeatured ? 'line-clamp-3' : 'line-clamp-2'
                      }`}>
                        {post.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {post.categories.slice(0, 2).map((category) => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                      {post.tags.slice(0, isFeatured ? 3 : 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                      {(post.categories.length > 2 || post.tags.length > (isFeatured ? 3 : 2)) && (
                        <Badge variant="secondary" className="text-xs">
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
