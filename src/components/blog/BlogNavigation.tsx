import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import type { Post } from '../../../.velite'

interface BlogNavigationProps {
  previousPost: Post | null
  nextPost: Post | null
}

export function BlogNavigation({ previousPost, nextPost }: BlogNavigationProps) {
  if (!previousPost && !nextPost) {
    return null
  }

  return (
    <nav className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Previous Post */}
        <div className="md:col-span-1">
          {previousPost ? (
            <Link href={previousPost.permalink}>
              <Card className="h-full hover:shadow-md transition-shadow group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Post</span>
                  </div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                    {previousPost.title}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <div /> // Empty div for grid alignment
          )}
        </div>

        {/* Next Post */}
        <div className="md:col-span-1">
          {nextPost ? (
            <Link href={nextPost.permalink}>
              <Card className="h-full hover:shadow-md transition-shadow group">
                <CardContent className="p-6 text-right">
                  <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                    <span>Next Post</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                    {nextPost.title}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <div /> // Empty div for grid alignment
          )}
        </div>
      </div>
    </nav>
  )
}
