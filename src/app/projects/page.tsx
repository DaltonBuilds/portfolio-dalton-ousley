import { Metadata } from 'next'
import { posts } from '../../../.velite'
import { getProjectPosts } from '@/lib/projects'
import { ProjectsContent } from '@/components/projects'

export const metadata: Metadata = {
  title: 'Projects | Dalton Ousley',
  description: 'Explore my portfolio of cloud engineering, DevOps, and full-stack development projects. Each project demonstrates production-ready architecture, security best practices, and modern infrastructure patterns.',
  openGraph: {
    title: 'Projects | Dalton Ousley',
    description: 'Explore my portfolio of cloud engineering, DevOps, and full-stack development projects.',
    type: 'website',
  },
}

export default function ProjectsPage() {
  // Get all project posts from Velite (server-side)
  const projectPosts = getProjectPosts(posts)

  return <ProjectsContent projects={projectPosts} />
}


