"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Cloud, 
  Zap, 
  GitBranch, 
  Monitor, 
  Database,
  Network
} from 'lucide-react';

interface Skill {
  name: string;
  category: 'Programming' | 'Cloud' | 'Automation';
  proficiency: number; // 1-5
  icon: React.ReactNode;
  description: string;
  projects?: string[];
}

const skillsData: Skill[] = [
  {
    name: 'JavaScript',
    category: 'Programming',
    proficiency: 5,
    icon: <Code2 className="w-5 h-5" />,
    description: 'Full-stack development with modern frameworks',
    projects: ['AI-powered CRM', 'LMS Platform']
  },
  {
    name: 'TypeScript',
    category: 'Programming',
    proficiency: 5,
    icon: <Code2 className="w-5 h-5" />,
    description: 'Type-safe development for scalable applications',
    projects: ['Portfolio', 'Enterprise APIs']
  },
  {
    name: 'Python',
    category: 'Programming',
    proficiency: 4,
    icon: <Code2 className="w-5 h-5" />,
    description: 'Automation, data processing, and ML workflows',
    projects: ['Data Pipelines', 'Automation Scripts']
  },
  {
    name: 'React',
    category: 'Programming',
    proficiency: 5,
    icon: <Code2 className="w-5 h-5" />,
    description: 'Component-based UI development',
    projects: ['LMS Frontend', 'Dashboard UIs']
  },
  {
    name: 'Next.js',
    category: 'Programming',
    proficiency: 5,
    icon: <Code2 className="w-5 h-5" />,
    description: 'Full-stack React applications with SSR/SSG',
    projects: ['Portfolio', 'Client Websites']
  },
  {
    name: 'SQL',
    category: 'Programming',
    proficiency: 4,
    icon: <Database className="w-5 h-5" />,
    description: 'Database design and complex queries',
    projects: ['CRM Analytics', 'Reporting Systems']
  },
  {
    name: 'Kubernetes',
    category: 'Cloud',
    proficiency: 4,
    icon: <Cloud className="w-5 h-5" />,
    description: 'Container orchestration and cluster management',
    projects: ['GKE Platform', 'Microservices Deploy']
  },
  {
    name: 'Docker',
    category: 'Cloud',
    proficiency: 5,
    icon: <Cloud className="w-5 h-5" />,
    description: 'Containerization and multi-stage builds',
    projects: ['CI/CD Pipelines', 'Dev Environments']
  },
  {
    name: 'CI/CD',
    category: 'Cloud',
    proficiency: 5,
    icon: <GitBranch className="w-5 h-5" />,
    description: 'Automated deployment pipelines',
    projects: ['GitHub Actions', 'Blue/Green Deploy']
  },
  {
    name: 'Grafana',
    category: 'Cloud',
    proficiency: 4,
    icon: <Monitor className="w-5 h-5" />,
    description: 'Observability dashboards and alerting',
    projects: ['SRE Monitoring', 'Performance Tracking']
  },
  {
    name: 'Prometheus',
    category: 'Cloud',
    proficiency: 4,
    icon: <Monitor className="w-5 h-5" />,
    description: 'Metrics collection and time-series data',
    projects: ['Infrastructure Monitoring', 'SLO Tracking']
  },
  {
    name: 'GoHighLevel',
    category: 'Automation',
    proficiency: 5,
    icon: <Zap className="w-5 h-5" />,
    description: 'CRM automation and funnel optimization',
    projects: ['Client Onboarding', 'Lead Scoring']
  },
  {
    name: 'HubSpot',
    category: 'Automation',
    proficiency: 4,
    icon: <Zap className="w-5 h-5" />,
    description: 'Marketing automation and CRM integration',
    projects: ['Sales Workflows', 'Customer Journey']
  },
  {
    name: 'Zapier',
    category: 'Automation',
    proficiency: 5,
    icon: <Zap className="w-5 h-5" />,
    description: 'No-code automation and API integrations',
    projects: ['Workflow Automation', 'Data Sync']
  },
  {
    name: 'API Integrations',
    category: 'Automation',
    proficiency: 5,
    icon: <Network className="w-5 h-5" />,
    description: 'RESTful APIs and webhook implementations',
    projects: ['Payment Gateways', 'Third-party Integrations']
  },
  {
    name: 'Webhooks',
    category: 'Automation',
    proficiency: 4,
    icon: <Network className="w-5 h-5" />,
    description: 'Event-driven automation and real-time sync',
    projects: ['Real-time Updates', 'Event Processing']
  }
];

const categoryColors = {
  'Programming': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'Cloud': 'bg-green-500/10 text-green-600 border-green-500/20',
  'Automation': 'bg-orange-500/10 text-orange-600 border-orange-500/20'
};

const categoryIcons = {
  'Programming': <Code2 className="w-4 h-4" />,
  'Cloud': <Cloud className="w-4 h-4" />,
  'Automation': <Zap className="w-4 h-4" />
};

function ProficiencyBar({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((dot) => (
        <motion.div
          key={dot}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: dot * 0.1 }}
          className={`w-2 h-2 rounded-full ${
            dot <= level 
              ? 'bg-primary' 
              : 'bg-muted-foreground/20'
          }`}
        />
      ))}
    </div>
  );
}

function SkillCard({ skill, isActive, onClick }: { 
  skill: Skill; 
  isActive: boolean; 
  onClick: () => void; 
}) {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-pressed={isActive}
      aria-label={`${skill.name} skill details. ${isActive ? 'Expanded' : 'Collapsed'}`}
    >
      <Card className={`h-full transition-all duration-300 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${
        isActive 
          ? 'border-primary/60 shadow-lg shadow-primary/10 bg-primary/5' 
          : 'hover:border-primary/40 hover:shadow-md'
      }`}>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary" aria-hidden="true">
                {skill.icon}
              </div>
              <h3 className="font-semibold text-sm">{skill.name}</h3>
            </div>
            <Badge className={`text-xs ${categoryColors[skill.category]}`}>
              <span aria-hidden="true">{categoryIcons[skill.category]}</span>
              <span className="ml-1">{skill.category}</span>
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Proficiency</span>
              <ProficiencyBar level={skill.proficiency} />
            </div>
            
            <p className="text-xs text-muted-foreground line-clamp-2">
              {skill.description}
            </p>
          </div>
          
          <AnimatePresence>
            {isActive && skill.projects && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1 border-t pt-2"
              >
                <span className="text-xs font-medium text-muted-foreground">Used in:</span>
                <div className="flex flex-wrap gap-1">
                  {skill.projects.map((project) => (
                    <Badge key={project} variant="secondary" className="text-xs">
                      {project}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function InteractiveSkillsGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  const filteredSkills = selectedCategory 
    ? skillsData.filter(skill => skill.category === selectedCategory)
    : skillsData;

  const categories = ['Programming', 'Cloud', 'Automation'] as const;

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
            selectedCategory === null
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background hover:bg-muted border-border'
          }`}
          aria-pressed={selectedCategory === null}
          aria-label="Show all skills"
        >
          All Skills
        </motion.button>
        {categories.map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              selectedCategory === category
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background hover:bg-muted border-border'
            }`}
            aria-pressed={selectedCategory === category}
            aria-label={`Filter skills by ${category}`}
          >
            <span aria-hidden="true">{categoryIcons[category]}</span>
            {category}
          </motion.button>
        ))}
      </div>

      {/* Skills Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill.name}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <SkillCard
                skill={skill}
                isActive={activeSkill === skill.name}
                onClick={() => setActiveSkill(
                  activeSkill === skill.name ? null : skill.name
                )}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex justify-center gap-8 pt-4 text-center"
      >
        {categories.map((category) => {
          const categorySkills = skillsData.filter(s => s.category === category);
          const avgProficiency = categorySkills.reduce((acc, s) => acc + s.proficiency, 0) / categorySkills.length;
          
          return (
            <div key={category} className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium">
                {categoryIcons[category]}
                {category}
              </div>
              <div className="text-2xl font-bold text-primary">
                {categorySkills.length}
              </div>
              <div className="text-xs text-muted-foreground">
                Avg: {avgProficiency.toFixed(1)}/5
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
