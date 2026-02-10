import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ExternalLink, Github } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatDateForDisplay } from '@/lib/date-utils'
import { ProjectPost } from '../../../types/project'
import { StatusBadge } from './StatusBadge'
import { TechStackTags } from './TechStackTags'

interface ProjectCardProps {
  project: ProjectPost
}

/**
 * ProjectCard component displays a project post as a card
 * Includes image, title, description, status, category, date, tech stack, and action links
 * The entire card is clickable to navigate to the blog post permalink
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const formattedDate = formatDateForDisplay(project.date)

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* Image Section - Clickable */}
      {project.image && (
        <Link
          href={project.permalink}
          aria-label={`Read full article: ${project.title}`}
        >
          <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
            <Image
              src={project.image.src}
              alt={project.image.alt}
              width={400}
              height={192}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 400px"
              loading="lazy"
            />
          </div>
        </Link>
      )}

      <CardHeader className="pb-4">
        {/* Status and Category Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {project.projectStatus && (
            <StatusBadge status={project.projectStatus} />
          )}
          {project.projectCategory && (
            <Badge variant="outline" className="text-xs">
              {project.projectCategory}
            </Badge>
          )}
        </div>

        {/* Title - Clickable */}
        <Link
          href={project.permalink}
          className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
          aria-label={`Read full article: ${project.title}`}
        >
          <h3 className="text-lg md:text-xl font-bold leading-tight hover:text-primary transition-colors cursor-pointer">
            {project.title}
          </h3>
        </Link>

        {/* Date */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
          <Calendar className="w-4 h-4" aria-hidden="true" />
          <time dateTime={project.date}>{formattedDate}</time>
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex flex-col flex-grow">
        {/* Description */}
        {project.description && (
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {project.description}
          </p>
        )}

        {/* Tech Stack Tags */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="mb-4">
            <TechStackTags technologies={project.techStack} maxDisplay={5} />
          </div>
        )}

        {/* Action Links */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.projectUrl && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View live project: ${project.title}`}
              >
                <ExternalLink className="w-4 h-4" />
                View Project
              </a>
            </Button>
          )}
          {project.githubUrl && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View source code: ${project.title}`}
              >
                <Github className="w-4 h-4" />
                View Code
              </a>
            </Button>
          )}
          <Button
            asChild
            variant="link"
            size="sm"
            className="ml-auto"
          >
            <Link href={project.permalink}>Read More →</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
