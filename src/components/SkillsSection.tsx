import React from 'react';
import SectionHeader from './SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { 
  Lightbulb, 
  Code, 
  Server, 
  Cloud, 
  Database, 
  Brush, 
  Rocket, 
  Zap
} from 'lucide-react';

interface SkillProps {
  title: string;
  icon: React.ElementType;
  description: string;
}

const skills: SkillProps[] = [
  {
    title: "Frontend Development",
    icon: Code,
    description: "Building responsive and interactive user interfaces with modern frameworks.",
  },
  {
    title: "Backend Development",
    icon: Server,
    description: "Designing and implementing robust server-side logic and APIs.",
  },
  {
    title: "Cloud & DevOps",
    icon: Cloud,
    description: "Deploying and managing scalable applications on cloud platforms.",
  },
  {
    title: "Database Management",
    icon: Database,
    description: "Working with relational and NoSQL databases for efficient data storage.",
  },
  {
    title: "UI/UX Design",
    icon: Brush,
    description: "Creating intuitive and aesthetically pleasing user experiences.",
  },
  {
    title: "Performance Optimization",
    icon: Zap,
    description: "Optimizing web applications for maximum speed and efficiency.",
  },
  {
    title: "Solution Architecture",
    icon: Lightbulb,
    description: "Designing comprehensive technical solutions for complex business problems.",
  },
  {
    title: "API Integration",
    icon: Rocket,
    description: "Seamlessly integrating third-party services and APIs into applications.",
  },
];

const SkillsSection: React.FC = () => {
  return (
    <section id="skills" className="container mx-auto py-16 px-4">
      <SectionHeader title="My Skills" icon={Lightbulb} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {skills.map((skill, index) => (
          <Card 
            key={index} 
            className="border-2 border-blue-500 transform transition-all duration-300 hover:scale-105 hover:border-orange-500 shadow-lg shadow-blue-500/20 hover:shadow-orange-500/30 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <skill.icon size={36} className="text-secondary" />
              <CardTitle className="text-xl font-semibold text-primary">{skill.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">{skill.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;