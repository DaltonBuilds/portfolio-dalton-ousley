/**
 * Tests for extensibility features: pagination and series support
 */

import { getProjectPosts, groupProjectsBySeries } from '../projects'
import { ProjectPost } from '../../../types/project'

describe('Project Extensibility Features', () => {
  const mockProjects: ProjectPost[] = [
    {
      title: 'Project 1',
      slug: 'project-1',
      date: '2024-01-15',
      published: true,
      featured: false,
      author: 'test',
      categories: ['projects'],
      tags: ['tag1'],
      techStack: ['tech1'],
      seo: { keywords: [] },
      body: 'content',
      readingTime: 5,
      permalink: '/blog/project-1',
      series: 'Series A',
      seriesOrder: 1,
    },
    {
      title: 'Project 2',
      slug: 'project-2',
      date: '2024-01-14',
      published: true,
      featured: false,
      author: 'test',
      categories: ['projects'],
      tags: ['tag2'],
      techStack: ['tech2'],
      seo: { keywords: [] },
      body: 'content',
      readingTime: 5,
      permalink: '/blog/project-2',
      series: 'Series A',
      seriesOrder: 2,
    },
    {
      title: 'Project 3',
      slug: 'project-3',
      date: '2024-01-13',
      published: true,
      featured: false,
      author: 'test',
      categories: ['projects'],
      tags: ['tag3'],
      techStack: ['tech3'],
      seo: { keywords: [] },
      body: 'content',
      readingTime: 5,
      permalink: '/blog/project-3',
      series: 'Series B',
      seriesOrder: 1,
    },
    {
      title: 'Project 4',
      slug: 'project-4',
      date: '2024-01-12',
      published: true,
      featured: false,
      author: 'test',
      categories: ['projects'],
      tags: ['tag4'],
      techStack: ['tech4'],
      seo: { keywords: [] },
      body: 'content',
      readingTime: 5,
      permalink: '/blog/project-4',
    },
  ]

  describe('Pagination Support', () => {
    it('returns all projects when no pagination params provided', () => {
      const result = getProjectPosts(mockProjects)
      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(4)
    })

    it('returns paginated results with correct structure', () => {
      const result = getProjectPosts(mockProjects, { page: 1, pageSize: 2 })
      expect(result).toHaveProperty('projects')
      expect(result).toHaveProperty('total')
      expect(result).toHaveProperty('page')
      expect(result).toHaveProperty('pageSize')
      expect(result).toHaveProperty('totalPages')
    })

    it('returns correct first page of results', () => {
      const result = getProjectPosts(mockProjects, { page: 1, pageSize: 2 })
      if ('projects' in result) {
        expect(result.projects).toHaveLength(2)
        expect(result.projects[0].title).toBe('Project 1')
        expect(result.projects[1].title).toBe('Project 2')
        expect(result.total).toBe(4)
        expect(result.totalPages).toBe(2)
      }
    })

    it('returns correct second page of results', () => {
      const result = getProjectPosts(mockProjects, { page: 2, pageSize: 2 })
      if ('projects' in result) {
        expect(result.projects).toHaveLength(2)
        expect(result.projects[0].title).toBe('Project 3')
        expect(result.projects[1].title).toBe('Project 4')
      }
    })

    it('handles page beyond available data', () => {
      const result = getProjectPosts(mockProjects, { page: 10, pageSize: 2 })
      if ('projects' in result) {
        expect(result.projects).toHaveLength(0)
        expect(result.total).toBe(4)
      }
    })
  })

  describe('Series Support', () => {
    it('groups projects by series correctly', () => {
      const grouped = groupProjectsBySeries(mockProjects)
      expect(Object.keys(grouped)).toHaveLength(2)
      expect(grouped['Series A']).toHaveLength(2)
      expect(grouped['Series B']).toHaveLength(1)
    })

    it('sorts projects within series by seriesOrder', () => {
      const grouped = groupProjectsBySeries(mockProjects)
      expect(grouped['Series A'][0].seriesOrder).toBe(1)
      expect(grouped['Series A'][1].seriesOrder).toBe(2)
    })

    it('excludes projects without series field', () => {
      const grouped = groupProjectsBySeries(mockProjects)
      const allGroupedProjects = Object.values(grouped).flat()
      expect(allGroupedProjects).toHaveLength(3)
      expect(allGroupedProjects.every(p => p.series)).toBe(true)
    })

    it('handles empty array', () => {
      const grouped = groupProjectsBySeries([])
      expect(Object.keys(grouped)).toHaveLength(0)
    })

    it('handles projects with missing seriesOrder', () => {
      const projectsWithMissingOrder: ProjectPost[] = [
        {
          ...mockProjects[0],
          series: 'Test Series',
          seriesOrder: 1,
        },
        {
          ...mockProjects[1],
          series: 'Test Series',
          seriesOrder: undefined,
        },
      ]
      const grouped = groupProjectsBySeries(projectsWithMissingOrder)
      expect(grouped['Test Series']).toHaveLength(2)
      // Project with seriesOrder should come first
      expect(grouped['Test Series'][0].seriesOrder).toBe(1)
    })
  })
})
