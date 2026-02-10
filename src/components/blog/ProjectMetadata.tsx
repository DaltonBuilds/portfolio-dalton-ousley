import Link from 'next/link'
import { ExternalLink, Github, FolderKanban } from 'lucide-react'
import { StatusBadge } from '@/components/projects/StatusBadge'
import { TechStackTags } from '@/components/projects/TechStackTags'
import { Button } from '@/components/ui/Button'
import { isProjectPost } from '../../../types/project'
import type { Post } from '../../../.velite'

interface ProjectMetadataProps {
  post: Post
}

/**
 * ProjectMetadata component displays project-specific information on blog post pages
 * Only renders if the post is a project post (has "projects" in categories)
 */
export function ProjectMetadata({ post }: ProjectMetadataProps) {
  // Only render for project posts
  if (!isProjectPost(post)) {
    return null
  }

  const hasLinks = post.projectUrl || post.githubUrl
  const hasTechStack = post.techStack && post.techStack.length > 0

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
      <div className="container mx-auto max-w-screen-2xl py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <FolderKanban className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Project Details</h2>
          </div>

          <div className="space-y-4">
            {/* Status and Category Row */}
            <div className="flex flex-wrap items-center gap-4">
              {post.projectStatus && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <StatusBadge status={post.projectStatus} />
                </div>
              )}

              {post.projectCategory && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Category:</span>
                  <span className="text-sm font-medium text-foreground">
                    {post.projectCategory}
                  </span>
                </div>
              )}
            </div>

            {/* Tech Stack */}
            {hasTechStack && (
              <div>
                <span className="text-sm text-muted-foreground mb-2 block">
                  Technologies:
                </span>
                <TechStackTags technologies={post.techStack} />
              </div>
            )}

            {/* Project Links */}
            {hasLinks && (
              <div className="flex flex-wrap gap-3 pt-2">
                {post.projectUrl && (
                  <Button asChild variant="default" size="sm">
                    <Link
                      href={post.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Project
                    </Link>
                  </Button>
                )}

                {post.githubUrl && (
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={post.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <Github className="w-4 h-4" />
                      View Code
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
