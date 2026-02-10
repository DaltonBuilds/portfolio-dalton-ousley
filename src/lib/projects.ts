/**
 * Project utility functions for the Dynamic Project Showcase System
 * 
 * This module provides functions for filtering, grouping, and managing project posts
 * that are sourced from the Velite-processed blog posts.
 */

import { ProjectPost, ProjectFilters, GroupedProjects, ProjectStatus, PaginationParams, PaginatedProjects, GroupedProjectsBySeries } from '../../types/project'

/**
 * Filters all posts to return only project posts
 * A project post has "projects" in its categories array and is published
 * 
 * @param posts - Array of all blog posts from Velite
 * @param pagination - Optional pagination parameters (page, pageSize)
 * @returns Array of project posts sorted by date (newest first) or paginated results
 */
export function getProjectPosts(posts: any[]): ProjectPost[]
export function getProjectPosts(posts: any[], pagination: PaginationParams): PaginatedProjects
export function getProjectPosts(posts: any[], pagination?: PaginationParams): ProjectPost[] | PaginatedProjects {
  const allProjects = posts
    .filter(post => post.published && post.categories.includes('projects'))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) as ProjectPost[]

  // If no pagination params, return all projects
  if (!pagination) {
    return allProjects
  }

  // Calculate pagination
  const { page, pageSize } = pagination
  const total = allProjects.length
  const totalPages = Math.ceil(total / pageSize)
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const projects = allProjects.slice(startIndex, endIndex)

  return {
    projects,
    total,
    page,
    pageSize,
    totalPages
  }
}

/**
 * Groups project posts by their projectCategory
 * Posts without a category go into "Uncategorized"
 * 
 * @param projects - Array of project posts
 * @returns Object mapping category names to arrays of projects
 */
export function groupProjectsByCategory(projects: ProjectPost[]): GroupedProjects {
  return projects.reduce((acc, project) => {
    const category = project.projectCategory || 'Uncategorized'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(project)
    return acc
  }, {} as GroupedProjects)
}

/**
 * Extracts unique technologies from all project posts
 * Combines both tags and techStack fields
 * 
 * @param projects - Array of project posts
 * @returns Sorted array of unique technology names
 */
export function getAllTechnologies(projects: ProjectPost[]): string[] {
  const techSet = new Set<string>()
  projects.forEach(project => {
    project.tags.forEach(tag => techSet.add(tag))
    project.techStack.forEach(tech => techSet.add(tech))
  })
  return Array.from(techSet).sort()
}

/**
 * Filters projects based on user-selected filters
 * 
 * @param projects - Array of project posts
 * @param filters - Filter criteria (status, technologies, category)
 * @returns Filtered array of projects matching all criteria
 */
export function filterProjects(
  projects: ProjectPost[],
  filters: ProjectFilters
): ProjectPost[] {
  return projects.filter(project => {
    // Status filter
    if (filters.status && project.projectStatus !== filters.status) {
      return false
    }
    
    // Technology filter (match any selected tech)
    if (filters.technologies.length > 0) {
      const projectTechs = [...project.tags, ...project.techStack]
      const hasMatchingTech = filters.technologies.some(tech =>
        projectTechs.includes(tech)
      )
      if (!hasMatchingTech) return false
    }
    
    // Category filter
    if (filters.category && project.projectCategory !== filters.category) {
      return false
    }
    
    return true
  })
}

/**
 * Gets count of projects by status
 * 
 * @param projects - Array of project posts
 * @returns Object mapping each status to its count
 */
export function getProjectCountsByStatus(projects: ProjectPost[]): Record<ProjectStatus, number> {
  const counts: Record<ProjectStatus, number> = {
    'Completed': 0,
    'In Progress': 0,
    'Not Started': 0
  }
  
  projects.forEach(project => {
    const status = project.projectStatus || 'Not Started'
    counts[status] = (counts[status] || 0) + 1
  })
  
  return counts
}

/**
 * Groups project posts by their series field
 * Posts within each series are sorted by seriesOrder
 * Posts without a series are excluded from the result
 * 
 * @param projects - Array of project posts
 * @returns Object mapping series names to arrays of projects ordered by seriesOrder
 */
export function groupProjectsBySeries(projects: ProjectPost[]): GroupedProjectsBySeries {
  // Filter projects that have a series field
  const seriesProjects = projects.filter(project => project.series)
  
  // Group by series
  const grouped = seriesProjects.reduce((acc, project) => {
    const series = project.series!
    if (!acc[series]) {
      acc[series] = []
    }
    acc[series].push(project)
    return acc
  }, {} as GroupedProjectsBySeries)
  
  // Sort each series by seriesOrder
  Object.keys(grouped).forEach(series => {
    grouped[series].sort((a, b) => {
      const orderA = a.seriesOrder ?? Number.MAX_SAFE_INTEGER
      const orderB = b.seriesOrder ?? Number.MAX_SAFE_INTEGER
      return orderA - orderB
    })
  })
  
  return grouped
}
