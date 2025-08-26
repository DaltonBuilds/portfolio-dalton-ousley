import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { posts } from '../../../../../.velite'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { BlogSidebar } from '@/components/blog/BlogSidebar'
import SectionHeader from '@/components/SectionHeader'

interface TagPageProps {
  params: {
    tag: string
  }
}

export async function generateStaticParams() {
  // Get all unique tags from published posts
  const allTags = posts
    .filter((post) => post.published)
    .flatMap((post) => post.tags)
    
  const uniqueTags = Array.from(new Set(allTags))
  
  return uniqueTags.map((tag) => ({
    tag: tag,
  }))
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag)
  
  // Check if tag exists
  const tagExists = posts
    .filter((post) => post.published)
    .some((post) => post.tags.includes(tag))

  if (!tagExists) {
    return {}
  }

  return {
    title: `#${tag} | Blog | Dalton Ousley`,
    description: `All blog posts tagged with #${tag} - DevOps, Kubernetes, cloud architecture, and infrastructure insights.`,
    openGraph: {
      title: `#${tag} | Blog | Dalton Ousley`,
      description: `All blog posts tagged with #${tag} - DevOps, Kubernetes, cloud architecture, and infrastructure insights.`,
      type: 'website',
    },
  }
}

export default function TagPage({ params }: TagPageProps) {
  const tag = decodeURIComponent(params.tag)

  // Filter posts by tag
  const tagPosts = posts
    .filter((post) => post.published && post.tags.includes(tag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (tagPosts.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto max-w-screen-2xl px-6 md:px-10 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <SectionHeader
              title={`#${tag}`}
              subtitle={`All posts tagged with #${tag} • ${tagPosts.length} post${tagPosts.length !== 1 ? 's' : ''}`}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto max-w-screen-2xl px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 gap-6">
                {tagPosts.map((post) => (
                  <BlogPostCard key={post.slug} post={post} />
                ))}
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
