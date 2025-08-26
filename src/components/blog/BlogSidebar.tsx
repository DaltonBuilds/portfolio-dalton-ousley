import Link from 'next/link'
import { posts, categories } from '../../../.velite'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDateShort } from '@/lib/date-utils'

export function BlogSidebar() {
  // Get published posts
  const publishedPosts = posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Get recent posts (last 5)
  const recentPosts = publishedPosts.slice(0, 5)

  // Get all unique tags with counts
  const tagCounts = publishedPosts.reduce((acc, post) => {
    post.tags.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  const popularTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)

  // Get category counts
  const categoryCounts = publishedPosts.reduce((acc, post) => {
    post.categories.forEach((category) => {
      acc[category] = (acc[category] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  // Get categories list - categories is an array with one object containing categories
  const categoryList = categories[0]?.categories || []

  return (
    <div className="space-y-8">
      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.slug}>
                <Link 
                  href={post.permalink}
                  className="block group"
                >
                  <h4 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDateShort(post.date)}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categoryList
              .filter((category) => categoryCounts[category.name] > 0)
              .map((category) => (
                <Link 
                  key={category.slug}
                  href={`/blog/category/${category.slug}`}
                  className="flex items-center justify-between py-1 px-2 rounded hover:bg-muted transition-colors"
                >
                  <span className="text-sm">{category.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {categoryCounts[category.name] || 0}
                  </Badge>
                </Link>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Popular Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(([tag, count]) => (
              <Link key={tag} href={`/blog/tag/${tag}`}>
                <Badge 
                  variant="outline" 
                  className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  #{tag} ({count})
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Blog Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Blog Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Posts:</span>
              <span className="font-medium">{publishedPosts.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Categories:</span>
              <span className="font-medium">{Object.keys(categoryCounts).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tags:</span>
              <span className="font-medium">{Object.keys(tagCounts).length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
