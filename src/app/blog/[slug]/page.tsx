import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { posts, authors } from '../../../../.velite'
import { BlogPostHeader } from '@/components/blog/BlogPostHeader'
import { BlogPostContent } from '@/components/blog/BlogPostContent'
import { BlogNavigation } from '@/components/blog/BlogNavigation'
import { AuthorCard } from '@/components/blog/AuthorCard'
import { ProjectMetadata } from '@/components/blog/ProjectMetadata'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return posts
    .filter((post) => post.published)
    .map((post) => ({
      slug: post.slug,
    }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = posts.find((post) => post.slug === slug)

  if (!post || !post.published) {
    return {}
  }

  const ogImage = post.seo?.ogImage || post.image?.src
  const keywords = post.seo?.keywords || post.tags

  return {
    title: `${post.title} | Dalton Ousley`,
    description: post.description || `Read about ${post.title} on Dalton Ousley's blog`,
    keywords: keywords?.join(', '),
    authors: [{ name: 'Dalton Ousley' }],
    openGraph: {
      title: post.title,
      description: post.description || `Read about ${post.title} on Dalton Ousley's blog`,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.lastModified || post.date,
      authors: ['Dalton Ousley'],
      tags: post.tags,
      images: ogImage ? [{ url: ogImage, alt: post.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || `Read about ${post.title} on Dalton Ousley's blog`,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = posts.find((post) => post.slug === slug)

  if (!post || !post.published) {
    notFound()
  }

  const author = authors.find((author) => author.name === post.author)
  
  // Find previous and next posts
  const publishedPosts = posts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  const currentIndex = publishedPosts.findIndex((p) => p.slug === post.slug)
  const previousPost = currentIndex < publishedPosts.length - 1 ? publishedPosts[currentIndex + 1] : null
  const nextPost = currentIndex > 0 ? publishedPosts[currentIndex - 1] : null

  return (
    <article className="min-h-screen bg-background">
      {/* Post Header */}
      <BlogPostHeader post={post} author={author} />

      {/* Project Metadata - appears prominently after header for project posts */}
      <ProjectMetadata post={post} />

      {/* Post Content */}
      <div className="container mx-auto max-w-screen-2xl section-padding px-4">
        <div className="max-w-4xl mx-auto overflow-visible">
          <BlogPostContent post={post} />

          {/* Author Card */}
          {author && (
            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
              <AuthorCard author={author} />
            </div>
          )}

          {/* Navigation */}
          <BlogNavigation previousPost={previousPost} nextPost={nextPost} />
        </div>
      </div>
    </article>
  )
}
