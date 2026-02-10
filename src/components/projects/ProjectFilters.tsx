'use client'

import { Filter, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ProjectFilters as ProjectFiltersType, ProjectPost, ProjectStatus } from '../../../types/project'
import { getAllTechnologies, getProjectCountsByStatus } from '@/lib/projects'
import { cn } from '@/lib/utils'

interface ProjectFiltersProps {
  projects: ProjectPost[]
  filters: ProjectFiltersType
  onFilterChange: (filters: ProjectFiltersType) => void
  className?: string
}

/**
 * ProjectFilters component provides UI controls for filtering projects
 * Includes status filter dropdown, technology multi-select, and category filter
 * Displays active filter count and provides clear filters functionality
 */
export function ProjectFilters({
  projects,
  filters,
  onFilterChange,
  className,
}: ProjectFiltersProps) {
  const statusCounts = getProjectCountsByStatus(projects)
  const allTechnologies = getAllTechnologies(projects)
  const allCategories = Array.from(
    new Set(projects.map((p) => p.projectCategory).filter(Boolean))
  ).sort() as string[]

  // Calculate active filter count
  const activeFilterCount =
    (filters.status ? 1 : 0) +
    filters.technologies.length +
    (filters.category ? 1 : 0)

  const handleStatusChange = (status: string) => {
    onFilterChange({
      ...filters,
      status: status === 'all' ? undefined : (status as ProjectStatus),
    })
  }

  const handleTechnologyToggle = (tech: string) => {
    const newTechnologies = filters.technologies.includes(tech)
      ? filters.technologies.filter((t) => t !== tech)
      : [...filters.technologies, tech]

    onFilterChange({
      ...filters,
      technologies: newTechnologies,
    })
  }

  const handleCategoryChange = (category: string) => {
    onFilterChange({
      ...filters,
      category: category === 'all' ? undefined : category,
    })
  }

  const handleClearFilters = () => {
    onFilterChange({
      status: undefined,
      technologies: [],
      category: undefined,
    })
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {/* Filter Icon and Label */}
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Filter className="w-4 h-4" aria-hidden="true" />
        <span>Filter by:</span>
      </div>

      {/* Status Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {filters.status || 'Status'}
            {filters.status && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0">
                1
              </Badge>
            )}
            <ChevronDown className="w-4 h-4 ml-1" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Project Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={filters.status || 'all'}
            onValueChange={handleStatusChange}
          >
            <DropdownMenuRadioItem value="all">
              All Projects
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Completed">
              Completed ({statusCounts['Completed']})
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="In Progress">
              In Progress ({statusCounts['In Progress']})
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Not Started">
              Not Started ({statusCounts['Not Started']})
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Technology Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            Technology
            {filters.technologies.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0">
                {filters.technologies.length}
              </Badge>
            )}
            <ChevronDown className="w-4 h-4 ml-1" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 max-h-96 overflow-y-auto">
          <DropdownMenuLabel>Technologies</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {allTechnologies.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              No technologies found
            </div>
          ) : (
            allTechnologies.map((tech) => (
              <DropdownMenuCheckboxItem
                key={tech}
                checked={filters.technologies.includes(tech)}
                onCheckedChange={() => handleTechnologyToggle(tech)}
              >
                {tech}
              </DropdownMenuCheckboxItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Category Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {filters.category || 'Category'}
            {filters.category && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0">
                1
              </Badge>
            )}
            <ChevronDown className="w-4 h-4 ml-1" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Project Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={filters.category || 'all'}
            onValueChange={handleCategoryChange}
          >
            <DropdownMenuRadioItem value="all">
              All Categories
            </DropdownMenuRadioItem>
            {allCategories.map((category) => (
              <DropdownMenuRadioItem key={category} value={category}>
                {category}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active Filter Count and Clear Button */}
      {activeFilterCount > 0 && (
        <>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className="font-normal">
              {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} active
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="flex items-center gap-1"
          >
            <X className="w-4 h-4" aria-hidden="true" />
            Clear filters
          </Button>
        </>
      )}
    </div>
  )
}
