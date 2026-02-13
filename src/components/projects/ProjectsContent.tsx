'use client'

import { useState } from 'react'
import { filterProjects } from '@/lib/projects'
import { ProjectFilters } from './ProjectFilters'
import { ProjectGrid } from './ProjectGrid'
import { ProjectFilters as ProjectFiltersType, ProjectPost } from '../../../types/project'

interface ProjectsContentProps {
  projects: ProjectPost[]
}

/**
 * ProjectsContent component handles client-side filtering and rendering
 * Separated from the page component to allow server-side metadata
 */
export function ProjectsContent({ projects }: ProjectsContentProps) {
  // Client-side filter state management
  const [filters, setFilters] = useState<ProjectFiltersType>({
    status: undefined,
    technologies: [],
    category: undefined,
  })

  // Apply filters to project posts
  const filteredProjects = filterProjects(projects, filters)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 section-padding">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4">
              Projects
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Explore my portfolio of cloud engineering, DevOps, and full-stack development projects. 
              Each project demonstrates production-ready architecture, security best practices, and modern infrastructure patterns.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Projects Section */}
      <section className="section-padding">
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          {/* Project Filters */}
          <div className="mb-8">
            <ProjectFilters
              projects={projects}
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>

          {/* Project Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
            </p>
          </div>

          {/* Project Grid */}
          <ProjectGrid projects={filteredProjects} />
        </div>
      </section>
    </div>
  )
}
