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
        <div className="container mx-auto max-w-screen-2xl py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <SectionHeader
              title="Blog"
              subtitle="Insights, tutorials, and thoughts on DevOps, Kubernetes, cloud architecture, and modern infrastructure practices"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto max-w-screen-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Featured Posts */}
              {featuredPosts.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-foreground">
                    Featured Posts
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredPosts.map((post) => (
                      <BlogPostCard key={post.slug} post={post} featured />
                    ))}
                  </div>
                </div>
              )}

              {/* All Posts */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-foreground">
                  {featuredPosts.length > 0 ? 'Latest Posts' : 'All Posts'}
                </h2>
                {regularPosts.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {regularPosts.map((post) => (
                      <BlogPostCard key={post.slug} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No posts available yet. Check back soon!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
