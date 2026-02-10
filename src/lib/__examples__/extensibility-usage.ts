/**
 * Example usage of extensibility features
 * This file demonstrates how to use pagination and series grouping
 */

import { getProjectPosts, groupProjectsBySeries } from '../projects'
import { posts } from '../../../.velite'

// Example 1: Get all projects (original behavior)
export function getAllProjects() {
  const allProjects = getProjectPosts(posts)
  return allProjects
}

// Example 2: Get paginated projects
export function getPaginatedProjects(page: number = 1, pageSize: number = 10) {
  const result = getProjectPosts(posts, { page, pageSize })
  
  // TypeScript knows this is PaginatedProjects type
  if ('projects' in result) {
    console.log(`Showing page ${result.page} of ${result.totalPages}`)
    console.log(`Total projects: ${result.total}`)
    return result
  }
}

// Example 3: Group projects by series
export function getProjectSeries() {
  const allProjects = getProjectPosts(posts)
  const seriesGroups = groupProjectsBySeries(allProjects)
  
  // Iterate through each series
  Object.entries(seriesGroups).forEach(([seriesName, projects]) => {
    console.log(`Series: ${seriesName}`)
    projects.forEach(project => {
      console.log(`  ${project.seriesOrder}. ${project.title}`)
    })
  })
  
  return seriesGroups
}

// Example 4: Combine pagination with series grouping
export function getPaginatedSeriesProjects(page: number = 1, pageSize: number = 5) {
  const result = getProjectPosts(posts, { page, pageSize })
  
  if ('projects' in result) {
    const seriesGroups = groupProjectsBySeries(result.projects)
    return {
      pagination: {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: result.totalPages,
      },
      seriesGroups,
    }
  }
}
