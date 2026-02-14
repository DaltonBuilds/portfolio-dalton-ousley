import { Metadata } from 'next'
import { posts } from '../../../.velite'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { BlogSidebar } from '@/components/blog/BlogSidebar'
import SectionHeader from '@/components/SectionHeader'
import ErrorBoundary from '@/components/ErrorBoundary'

export const metadata: Metadata = {
  title: 'Blog | Dalton Ousley',
  description: 'Insights and tutorials about DevOps, Kubernetes, cloud architecture, and modern infrastructure practices.',
  openGraph: {
    title: 'Blog | Dalton Ousley',
    description: 'Insights and tutorials about DevOps, Kubernetes, cloud architecture, and modern infrastructure practices.',
    type: 'website',
  },
}

export default function BlogPage() {
  // Filter only published posts and sort by date (newest first)
  const publishedPosts = posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const featuredPosts = publishedPosts.filter((post) => post.featured)
  const regularPosts = publishedPosts.filter((post) => !post.featured)

  return (
    <>
      {/* Hero Section */}
      <section className="border-b border-gray-200 dark:border-gray-800" aria-labelledby="blog-heading">
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 section-padding">
          <div className="text-center max-w-4xl mx-auto">
            <h1 id="blog-heading" className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4">
              Blog
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Insights, tutorials, and thoughts on DevOps, Kubernetes, cloud architecture, and modern infrastructure practices
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="section-padding">
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Main Content */}
            <main className="lg:col-span-3">
              {/* Featured Posts */}
              {featuredPosts.length > 0 && (
                <ErrorBoundary isolate>
                  <section className="mb-8 sm:mb-12" aria-labelledby="featured-posts-heading">
                    <h2 id="featured-posts-heading" className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-foreground">
                      Featured Posts
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {featuredPosts.map((post) => (
                        <BlogPostCard key={post.slug} post={post} featured />
                      ))}
                    </div>
                  </section>
                </ErrorBoundary>
              )}

              {/* All Posts */}
              <ErrorBoundary isolate>
                <section aria-labelledby="all-posts-heading">
                  <h2 id="all-posts-heading" className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-foreground">
                    {featuredPosts.length > 0 ? 'Latest Posts' : 'All Posts'}
                  </h2>
                  {regularPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {regularPosts.map((post) => (
                        <BlogPostCard key={post.slug} post={post} />
                      ))}
                    </div>
                  ) : featuredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {featuredPosts.map((post) => (
                        <BlogPostCard key={post.slug} post={post} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <p className="text-muted-foreground text-sm sm:text-base">
                        No posts available yet. Check back soon!
                      </p>
                    </div>
                  )}
                </section>
              </ErrorBoundary>
            </main>

            {/* Sidebar */}
            <aside className="lg:col-span-1 mt-8 lg:mt-0" aria-label="Blog sidebar">
              <ErrorBoundary isolate>
                <BlogSidebar />
              </ErrorBoundary>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
