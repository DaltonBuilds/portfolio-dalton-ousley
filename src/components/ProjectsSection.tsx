import React from 'react';
import SectionHeader from './SectionHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/Card';
import { Github, ExternalLink, Code } from 'lucide-react';
import { Button } from './ui/Button';
import Image from 'next/image';

interface ProjectProps {
  title: string;
  description: string;
  image: string;
  githubLink?: string;
  liveLink?: string;
  tags: string[];
}

import { PATHS } from '@/config/constants'

const projects: ProjectProps[] = [
  {
    title: "E-commerce Platform",
    description: "A full-stack e-commerce solution with user authentication, product catalog, and payment integration.",
    image: PATHS.PROFILE_IMAGE, // Placeholder image
    githubLink: "#",
    liveLink: "#",
    tags: ["Next.js", "Tailwind CSS", "Stripe", "PostgreSQL"],
  },
  {
    title: "Real-time Chat Application",
    description: "A real-time chat application with group chat functionality and direct messaging.",
    image: PATHS.PROFILE_IMAGE, // Placeholder image
    githubLink: "#",
    liveLink: "#",
    tags: ["React", "Node.js", "Socket.io", "MongoDB"],
  },
  {
    title: "Portfolio Website",
    description: "My personal portfolio website showcasing my projects and skills.",
    image: PATHS.PROFILE_IMAGE, // Placeholder image
    githubLink: "#",
    liveLink: "#",
    tags: ["Next.js", "TypeScript", "ShadCN UI", "Tailwind CSS"],
  },
  {
    title: "Task Management App",
    description: "A simple and intuitive task management application to boost productivity.",
    image: PATHS.PROFILE_IMAGE, // Placeholder image
    githubLink: "#",
    liveLink: "#",
    tags: ["Vue.js", "Firebase", "Vuetify"],
  },
];

const ProjectsSection: React.FC = () => {
  return (
    <section id="projects" className="container mx-auto py-16 px-4">
      <SectionHeader title="My Projects" icon={Code} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <Card 
            key={index} 
            className="flex flex-col md:flex-row overflow-hidden border-2 border-blue-500 transform transition-all duration-300 hover:scale-[1.03] hover:border-orange-500 shadow-lg shadow-blue-500/20 hover:shadow-orange-500/30 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative w-full md:w-2/5 h-48 md:h-auto">
              <Image 
                src={project.image}
                alt=""
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="flex flex-col justify-between w-full md:w-3/5">
              <div>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-primary mb-2">{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-sm mb-4">{project.description}</CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-3 py-1 bg-blue-500/10 text-blue-500 dark:bg-blue-500/30 dark:text-blue-200 rounded-full text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </div>
              <CardFooter className="flex justify-end gap-3 pt-0">
                {project.githubLink && (
                  <Button variant="ghost" size="icon" asChild>
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github className="text-secondary hover:text-primary" /></a>
                  </Button>
                )}
                {project.liveLink && (
                  <Button variant="ghost" size="icon" asChild>
                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer" aria-label="Live Demo"><ExternalLink className="text-secondary hover:text-primary" /></a>
                  </Button>
                )}
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;