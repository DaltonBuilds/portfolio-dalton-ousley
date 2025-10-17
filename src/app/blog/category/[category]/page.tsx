import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { posts, categories } from '../../../../../.velite'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { BlogSidebar } from '@/components/blog/BlogSidebar'
import SectionHeader from '@/components/SectionHeader'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export async function generateStaticParams() {
  const categoryList = categories[0]?.categories || []
  return categoryList.map((category) => ({
    category: category.slug,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params
  const categoryList = categories[0]?.categories || []
  const category = categoryList.find((cat) => cat.slug === categorySlug)

  if (!category) {
    return {}
  }

  return {
    title: `${category.name} | Blog | Dalton Ousley`,
    description: `${category.description} - Read all posts about ${category.name} on Dalton Ousley's blog.`,
    openGraph: {
      title: `${category.name} | Blog | Dalton Ousley`,
      description: `${category.description} - Read all posts about ${category.name} on Dalton Ousley's blog.`,
      type: 'website',
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params
  const categoryList = categories[0]?.categories || []
  const category = categoryList.find((cat) => cat.slug === categorySlug)

  if (!category) {
    notFound()
  }

  // Filter posts by category
  const categoryPosts = posts
    .filter((post) => post.published && post.categories.includes(category.name))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto max-w-screen-2xl py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <SectionHeader
              title={category.name}
              subtitle={`${category.description} • ${categoryPosts.length} post${categoryPosts.length !== 1 ? 's' : ''}`}
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
              {categoryPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {categoryPosts.map((post) => (
                    <BlogPostCard key={post.slug} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No posts in this category yet</h3>
                  <p className="text-muted-foreground">
                    Check back soon for posts about {category.name.toLowerCase()}!
                  </p>
                </div>
              )}
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
