/**
 * TypeScript types and interfaces for the Dynamic Project Showcase System
 */

/**
 * Project status enum representing the current state of a project
 */
export type ProjectStatus = 'Completed' | 'In Progress' | 'Not Started'

/**
 * Interface representing a blog post that is also a project
 * Extends the base Post type with project-specific fields
 */
export interface ProjectPost {
  // Core blog fields
  title: string
  slug: string
  description?: string
  date: string
  lastModified?: string
  published: boolean
  featured: boolean
  author: string
  categories: string[]
  tags: string[]
  series?: string
  seriesOrder?: number
  image?: {
    src: string
    alt: string
  }
  seo: {
    keywords: string[]
    ogImage?: string
  }
  body: string
  readingTime: number
  permalink: string

  // Project-specific fields
  projectCategory?: string
  projectStatus?: ProjectStatus
  techStack: string[]
  projectUrl?: string
  githubUrl?: string
  featuredOnExperience?: boolean
}

/**
 * Interface for filter state on the projects page
 */
export interface ProjectFilters {
  status?: ProjectStatus
  technologies: string[]
  category?: string
}

/**
 * Interface for projects grouped by category
 * Maps category names to arrays of project posts
 */
export interface GroupedProjects {
  [category: string]: ProjectPost[]
}

/**
 * Interface for pagination parameters
 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/**
 * Interface for paginated project results
 */
export interface PaginatedProjects {
  projects: ProjectPost[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * Interface for projects grouped by series
 * Maps series names to arrays of project posts ordered by seriesOrder
 */
export interface GroupedProjectsBySeries {
  [series: string]: ProjectPost[]
}

/**
 * Type guard function to identify if a post is a project post
 * A project post has "projects" in its categories array
 * 
 * @param post - Any blog post object
 * @returns true if the post is a project post, false otherwise
 */
export function isProjectPost(post: any): post is ProjectPost {
  return (
    post &&
    typeof post === 'object' &&
    Array.isArray(post.categories) &&
    post.categories.includes('projects')
  )
}
