import { defineConfig, defineCollection, s } from 'velite'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import readingTime from 'reading-time'
import { remarkMermaid } from './lib/remark-mermaid'

// Define the blog post collection
const posts = defineCollection({
  name: 'Post',
  pattern: 'blog/**/*.mdx',
  schema: s
    .object({
      title: s.string().max(99),
      slug: s.slug('posts'),
      description: s.string().max(999).optional(),
      date: s.isodate(),
      lastModified: s.isodate().optional(),
      published: s.boolean().default(true),
      featured: s.boolean().default(false),
      author: s.string().default('dalton-ousley'),
      categories: s.array(s.string()).default([]),
      tags: s.array(s.string()).default([]),
      series: s.string().optional(),
      seriesOrder: s.number().optional(),
      image: s
        .object({
          src: s.string(),
          alt: s.string(),
        })
        .optional(),
      seo: s
        .object({
          keywords: s.array(s.string()).default([]),
          ogImage: s.string().optional(),
        })
        .default({}),
      body: s.mdx(),
      
      // Project-specific fields
      projectCategory: s.string().optional(),
      projectStatus: s.enum(['Completed', 'In Progress', 'Not Started']).optional(),
      techStack: s.array(s.string()).default([]),
      projectUrl: s.string().url().optional(),
      githubUrl: s.string().url().optional(),
      featuredOnExperience: s.boolean().default(false),
    })
    .transform((data) => ({
      ...data,
      readingTime: Math.ceil(readingTime(data.body).minutes),
      permalink: `/blog/${data.slug}`,
    })),
})

// Define the author collection
const authors = defineCollection({
  name: 'Author',
  pattern: 'authors/**/*.json',
  schema: s.object({
    name: s.string(),
    bio: s.string(),
    avatar: s.string(),
    email: s.string().email().optional(),
    website: s.string().url().optional(),
    social: s
      .object({
        twitter: s.string().optional(),
        linkedin: s.string().optional(),
        github: s.string().optional(),
      })
      .default({}),
  }),
})

// Define the category collection
const categories = defineCollection({
  name: 'Category',
  pattern: 'config/categories.json',
  schema: s.object({
    categories: s.array(
      s.object({
        name: s.string(),
        slug: s.slug(),
        description: s.string(),
        color: s.string().default('#6366f1'),
      })
    ),
  }),
})

export default defineConfig({
  root: './content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { posts, authors, categories },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: {
            dark: 'github-dark',
            light: 'github-light',
          },
          keepBackground: false,
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            className: ['anchor'],
          },
        },
      ],
    ],
    remarkPlugins: [remarkMermaid],
  },
})
