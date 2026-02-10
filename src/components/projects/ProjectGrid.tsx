import { ProjectPost } from '../../../types/project'
import { ProjectCard } from './ProjectCard'
import { groupProjectsByCategory } from '@/lib/projects'
import { cn } from '@/lib/utils'

interface ProjectGridProps {
  projects: ProjectPost[]
  groupByCategory?: boolean
  className?: string
}

/**
 * ProjectGrid component renders projects in a responsive grid layout
 * Supports optional grouping by category with category headings
 * Handles empty state with helpful message
 */
export function ProjectGrid({
  projects,
  groupByCategory = false,
  className,
}: ProjectGridProps) {
  // Handle empty state
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <svg
            className="w-12 h-12 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No projects found</h3>
        <p className="text-muted-foreground max-w-md">
          No projects match your current filters. Try adjusting your filters or check back soon for new projects!
        </p>
      </div>
    )
  }

  // Render grouped by category
  if (groupByCategory) {
    const groupedProjects = groupProjectsByCategory(projects)
    const categories = Object.keys(groupedProjects).sort()

    return (
      <div className={cn('space-y-12', className)}>
        {categories.map((category) => {
          const categoryProjects = groupedProjects[category]
          
          // Only display categories that have projects
          if (categoryProjects.length === 0) {
            return null
          }

          return (
            <section key={category} className="space-y-6">
              {/* Category Heading */}
              <div className="border-b pb-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {category}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {categoryProjects.length}{' '}
                  {categoryProjects.length === 1 ? 'project' : 'projects'}
                </p>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryProjects.map((project: ProjectPost) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    )
  }

  // Render flat grid without grouping
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
        className
      )}
    >
      {projects.map((project: ProjectPost) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  )
}
