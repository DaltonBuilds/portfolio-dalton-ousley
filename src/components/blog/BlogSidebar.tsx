import Link from 'next/link'
import { posts, categories } from '../../../.velite'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDateShort } from '@/lib/date-utils'
import { 
  Clock, 
  FolderOpen, 
  Hash, 
  TrendingUp, 
  FileText, 
  Layers,
  Tag,
  Calendar,
  ChevronRight
} from 'lucide-react'

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

  // Calculate max count for progress bars
  const maxCategoryCount = Math.max(...Object.values(categoryCounts), 1)

  return (
    <div className="space-y-6">
      {/* Recent Posts */}
      <Card className="overflow-hidden border-l-4 border-l-primary backdrop-blur-md bg-card/80">
        <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Recent Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {recentPosts.map((post, index) => (
              <div 
                key={post.slug}
                className="group relative"
              >
                <Link 
                  href={post.permalink}
                  className="block"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center text-xs font-bold text-primary group-hover:from-primary group-hover:to-orange-500 group-hover:text-white transition-all duration-300">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDateShort(post.date)}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                  </div>
                </Link>
                {index < recentPosts.length - 1 && (
                  <div className="mt-4 border-b border-border/50" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="overflow-hidden border-l-4 border-l-orange-500 backdrop-blur-md bg-card/80">
        <CardHeader className="pb-3 bg-gradient-to-r from-orange-500/5 to-transparent">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-orange-500" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {categoryList
              .filter((category) => categoryCounts[category.name] > 0)
              .map((category) => {
                const count = categoryCounts[category.name] || 0
                const percentage = (count / maxCategoryCount) * 100
                
                return (
                  <Link 
                    key={category.slug}
                    href={`/blog/category/${category.slug}`}
                    className="block group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium group-hover:text-orange-500 transition-colors flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5" />
                        {category.name}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 group-hover:bg-orange-500 group-hover:text-white transition-colors"
                      >
                        {count}
                      </Badge>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500 group-hover:from-orange-600 group-hover:to-orange-700"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </Link>
                )
              })}
          </div>
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card className="overflow-hidden border-l-4 border-l-primary backdrop-blur-md bg-card/80">
        <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Hash className="w-4 h-4 text-primary" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-2">
            {popularTags.map(([tag, count], index) => {
              // Calculate size based on popularity (larger for more popular tags)
              const maxCount = popularTags[0][1]
              const minCount = popularTags[popularTags.length - 1][1]
              const range = maxCount - minCount
              const normalizedSize = range > 0 ? (count - minCount) / range : 0.5
              const fontSize = 0.75 + (normalizedSize * 0.25) // 0.75rem to 1rem
              
              return (
                <Link key={tag} href={`/blog/tag/${tag}`}>
                  <Badge 
                    variant="outline" 
                    className="hover:bg-gradient-to-r hover:from-primary hover:to-orange-500 hover:text-white hover:border-transparent transition-all duration-300 cursor-pointer group relative overflow-hidden"
                    style={{ fontSize: `${fontSize}rem` }}
                  >
                    <span className="relative z-10 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {tag}
                      <span className="ml-1 opacity-60 text-xs">({count})</span>
                    </span>
                  </Badge>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Blog Stats */}
      <Card className="overflow-hidden border-l-4 border-l-orange-500 backdrop-blur-md bg-card/80">
        <CardHeader className="pb-3 bg-gradient-to-r from-orange-500/5 to-transparent">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            Blog Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Total Posts
                </span>
                <span className="text-2xl font-bold text-foreground">
                  {publishedPosts.length}
                </span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full animate-pulse" style={{ width: '100%' }} />
              </div>
            </div>
            
            <div className="group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Layers className="w-4 h-4 text-orange-500" />
                  Categories
                </span>
                <span className="text-2xl font-bold text-foreground">
                  {Object.keys(categoryCounts).length}
                </span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-primary rounded-full" style={{ width: `${(Object.keys(categoryCounts).length / 10) * 100}%` }} />
              </div>
            </div>
            
            <div className="group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" />
                  Tags
                </span>
                <span className="text-2xl font-bold text-foreground">
                  {Object.keys(tagCounts).length}
                </span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full" style={{ width: `${(Object.keys(tagCounts).length / 20) * 100}%` }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
