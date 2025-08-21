import React from 'react';
import SectionHeader from './SectionHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/Card';
import { Github, ExternalLink } from 'lucide-react';
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

const projects: ProjectProps[] = [
  {
    title: "E-commerce Platform",
    description: "A full-stack e-commerce solution with user authentication, product catalog, and payment integration.",
    image: "/next.svg", // Placeholder image
    githubLink: "#",
    liveLink: "#",
    tags: ["Next.js", "Tailwind CSS", "Stripe", "PostgreSQL"],
  },
  {
    title: "Real-time Chat Application",
    description: "A real-time chat application with group chat functionality and direct messaging.",
    image: "/window.svg", // Placeholder image
    githubLink: "#",
    liveLink: "#",
    tags: ["React", "Node.js", "Socket.io", "MongoDB"],
  },
  {
    title: "Portfolio Website",
    description: "My personal portfolio website showcasing my projects and skills.",
    image: "/file.svg", // Placeholder image
    githubLink: "#",
    liveLink: "#",
    tags: ["Next.js", "TypeScript", "ShadCN UI", "Tailwind CSS"],
  },
  {
    title: "Task Management App",
    description: "A simple and intuitive task management application to boost productivity.",
    image: "/globe.svg", // Placeholder image
    githubLink: "#",
    liveLink: "#",
    tags: ["Vue.js", "Firebase", "Vuetify"],
  },
];

const ProjectsSection: React.FC = () => {
  return (
    <section id="projects" className="container mx-auto py-16 px-4">
      <SectionHeader title="My Projects" icon={Code} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <Card 
            key={index} 
            className="flex flex-col border-2 border-blue-500 transform transition-all duration-300 hover:scale-[1.03] hover:border-orange-500 shadow-lg shadow-blue-500/20 hover:shadow-orange-500/30 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="pb-0">
              <div className="relative w-full h-48 bg-muted rounded-t-lg overflow-hidden">
                <Image 
                  src={project.image}
                  alt={project.title}
                  layout="fill"
                  objectFit="contain"
                  className="p-4"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-grow pt-6">
              <CardTitle className="text-xl font-semibold text-primary mb-2">{project.title}</CardTitle>
              <CardDescription className="text-muted-foreground text-sm mb-4">{project.description}</CardDescription>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="px-3 py-1 bg-blue-500/10 text-blue-500 dark:bg-blue-500/30 dark:text-blue-200 rounded-full text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
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
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;