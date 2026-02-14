"use client";

import React from 'react';
import Link from 'next/link';
import { OptimizedImage } from '@/components/OptimizedImage';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';

import SectionHeader from '@/components/SectionHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProjectPost } from '../../../types/project';

interface FeaturedProjectsSectionProps {
  projects: ProjectPost[];
}

export default function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="section-padding">
      <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Featured Projects"
          subtitle="Real-world implementations demonstrating cloud architecture, DevOps practices, and full-stack development"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Card className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
                {/* Project Image */}
                {project.image && (
                  <Link href={`/blog/${project.slug}`} className="block relative h-48 w-full overflow-hidden rounded-t-lg">
                    <OptimizedImage
                      src={project.image.src}
                      alt={project.image.alt}
                      width={800}
                      height={384}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </Link>
                )}
                
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Link href={`/blog/${project.slug}`} className="flex-1">
                      <CardTitle className="hover:text-primary transition-colors">
                        {project.title}
                      </CardTitle>
                    </Link>
                    {project.projectStatus && (
                      <Badge 
                        variant={project.projectStatus === 'Completed' ? 'default' : 'secondary'}
                        className="shrink-0"
                      >
                        {project.projectStatus}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-between">
                  {/* Tech Stack */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.slice(0, 6).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground border border-border"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 6 && (
                        <span className="text-xs px-2 py-1 text-muted-foreground">
                          +{project.techStack.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Links */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <Button asChild variant="default" size="sm">
                      <Link href={`/blog/${project.slug}`}>
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    
                    {project.githubUrl && (
                      <Button asChild variant="ghost" size="sm">
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label="View on GitHub"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    
                    {project.projectUrl && (
                      <Button asChild variant="ghost" size="sm">
                        <a 
                          href={project.projectUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label="View live project"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA to Projects Page */}
        <div className="text-center">
          <Button asChild variant="secondary" size="lg">
            <Link href="/projects">
              View All Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
