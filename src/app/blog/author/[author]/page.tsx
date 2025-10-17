import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { posts, authors } from '../../../../../.velite'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface AuthorPageProps {
  params: Promise<{
    author: string
  }>
}

export async function generateStaticParams() {
  // Generate static params for all authors
  // The author slug should match the filename without .json extension
  return [
    { author: 'dalton-ousley' }, // matches dalton-ousley.json and post.author field
  ]
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  // For dalton-ousley, find the author by matching the filename pattern
  const { author: authorSlug } = await params
  const author = authors.find(() => authorSlug === 'dalton-ousley')

  if (!author) {
    return {
      title: 'Author Not Found | Dalton Ousley',
      description: 'The requested author page could not be found.',
    }
  }

  return {
    title: `${author.name} | Blog Authors | Dalton Ousley`,
    description: author.bio,
    openGraph: {
      title: `${author.name} | Blog Authors | Dalton Ousley`,
      description: author.bio,
      type: 'profile',
      images: author.avatar ? [{ url: author.avatar }] : undefined,
    },
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  // Find the author by matching the author slug with the filename pattern
  const { author: authorSlug } = await params
  const author = authors.find(() => authorSlug === 'dalton-ousley')

  if (!author) {
    notFound()
  }

  // Get all published posts by this author
  const authorPosts = posts
    .filter((post) => post.published && post.author === authorSlug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Get author stats
  const totalPosts = authorPosts.length
  const totalReadingTime = authorPosts.reduce((total, post) => total + post.readingTime, 0)
  
  // Get unique categories and tags from author's posts
  const authorCategories = [...new Set(authorPosts.flatMap(post => post.categories))]
  const authorTags = [...new Set(authorPosts.flatMap(post => post.tags))]

  return (
    <div className="min-h-screen bg-background">
      {/* Author Header */}
      <section className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto max-w-screen-2xl py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Author Avatar */}
              <div className="flex-shrink-0">
                <div className="relative w-32 h-32 md:w-40 md:h-40">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    fill
                    className="rounded-full object-cover border-4 border-primary/20"
                    priority
                  />
                </div>
              </div>

              {/* Author Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  {author.name}
                </h1>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {author.bio}
                </p>

                {/* Author Stats */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{totalPosts}</div>
                    <div className="text-sm text-muted-foreground">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{totalReadingTime}</div>
                    <div className="text-sm text-muted-foreground">Min Read</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{authorCategories.length}</div>
                    <div className="text-sm text-muted-foreground">Topics</div>
                  </div>
                </div>

                {/* Social Links */}
                {(author.social?.twitter || author.social?.linkedin || author.social?.github || author.website || author.email) && (
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    {author.website && (
                      <a
                        href={author.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <span>Website</span>
                      </a>
                    )}
                    {author.social?.twitter && (
                      <a
                        href={`https://twitter.com/${author.social.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <span>Twitter</span>
                      </a>
                    )}
                    {author.social?.linkedin && (
                      <a
                        href={`https://linkedin.com/in/${author.social.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {author.social?.github && (
                      <a
                        href={`https://github.com/${author.social.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                      >
                        <span>GitHub</span>
                      </a>
                    )}
                    {author.email && (
                      <a
                        href={`mailto:${author.email}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <span>Email</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto max-w-screen-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Posts */}
            <div className="lg:col-span-3">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Posts by {author.name}
                </h2>
                <p className="text-muted-foreground">
                  {totalPosts} {totalPosts === 1 ? 'post' : 'posts'} • {totalReadingTime} minutes of reading
                </p>
              </div>

              {authorPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {authorPosts.map((post) => (
                    <BlogPostCard key={post.slug} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    {author.name} hasn&apos;t published any posts yet. Check back soon!
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-8">
                {/* Author Categories */}
                {authorCategories.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Topics Covered</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {authorCategories.map((category) => (
                          <Link key={category} href={`/blog/category/${category}`}>
                            <Badge 
                              variant="secondary"
                              className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                            >
                              {category}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Author Tags */}
                {authorTags.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Popular Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {authorTags.slice(0, 15).map((tag) => (
                          <Link key={tag} href={`/blog/tag/${tag}`}>
                            <Badge 
                              variant="outline"
                              className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                            >
                              #{tag}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Back to Blog */}
                <Card>
                  <CardContent className="pt-6">
                    <Link 
                      href="/blog"
                      className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                    >
                      ← Back to All Posts
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
