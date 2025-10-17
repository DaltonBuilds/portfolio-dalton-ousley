import { Metadata } from 'next'
import { posts } from '../../../.velite'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { BlogSidebar } from '@/components/blog/BlogSidebar'
import SectionHeader from '@/components/SectionHeader'

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <SectionHeader
              title="Blog"
              subtitle="Insights, tutorials, and thoughts on DevOps, Kubernetes, cloud architecture, and modern infrastructure practices"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Featured Posts */}
              {featuredPosts.length > 0 && (
                <div className="mb-8 sm:mb-12">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-foreground">
                    Featured Posts
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {featuredPosts.map((post) => (
                      <BlogPostCard key={post.slug} post={post} featured />
                    ))}
                  </div>
                </div>
              )}

              {/* All Posts */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-foreground">
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
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 mt-8 lg:mt-0">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
