"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Cloud, 
  GitBranch, 
  Monitor,
  Container,
  Network,
  Shield,
  Boxes
} from 'lucide-react';

interface Skill {
  name: string;
  category: 'Container Orchestration' | 'CI/CD & GitOps' | 'Observability' | 'IaC & Cloud';
  proficiency: number; // 1-5
  icon: React.ReactNode;
  description: string;
  projects?: string[];
}

const skillsData: Skill[] = [
  // Container Orchestration
  {
    name: 'Kubernetes',
    category: 'Container Orchestration',
    proficiency: 4,
    icon: <Boxes className="w-5 h-5" />,
    description: 'Multi-node k3s cluster with production workloads',
    projects: ['Homelab K3s', 'ArgoCD Platform']
  },
  {
    name: 'Docker',
    category: 'Container Orchestration',
    proficiency: 5,
    icon: <Container className="w-5 h-5" />,
    description: 'Multi-stage builds, optimization, and orchestration',
    projects: ['Lambda Functions', 'Dev Environments']
  },
  {
    name: 'Helm',
    category: 'Container Orchestration',
    proficiency: 4,
    icon: <Boxes className="w-5 h-5" />,
    description: 'Package management and templating for K8s',
    projects: ['Homelab Services', 'App Deployments']
  },
  
  // CI/CD & GitOps
  {
    name: 'ArgoCD',
    category: 'CI/CD & GitOps',
    proficiency: 4,
    icon: <GitBranch className="w-5 h-5" />,
    description: 'GitOps continuous delivery with App-of-Apps',
    projects: ['Homelab GitOps', 'Declarative Config']
  },
  {
    name: 'GitHub Actions',
    category: 'CI/CD & GitOps',
    proficiency: 5,
    icon: <GitBranch className="w-5 h-5" />,
    description: 'Automated CI/CD pipelines and workflows',
    projects: ['Portfolio Deploy', 'Lambda Build']
  },
  {
    name: 'GitLab CI',
    category: 'CI/CD & GitOps',
    proficiency: 4,
    icon: <GitBranch className="w-5 h-5" />,
    description: 'Pipeline automation and deployment workflows',
    projects: ['Enterprise CI/CD', 'Multi-stage Pipelines']
  },
  {
    name: 'Git',
    category: 'CI/CD & GitOps',
    proficiency: 5,
    icon: <GitBranch className="w-5 h-5" />,
    description: 'Version control and collaboration',
    projects: ['All Projects', 'GitOps Repo']
  },
  
  // Observability
  {
    name: 'Prometheus',
    category: 'Observability',
    proficiency: 4,
    icon: <Monitor className="w-5 h-5" />,
    description: 'Metrics collection and time-series monitoring',
    projects: ['Homelab Monitoring', 'Cluster Metrics']
  },
  {
    name: 'Grafana',
    category: 'Observability',
    proficiency: 4,
    icon: <Monitor className="w-5 h-5" />,
    description: 'Visualization dashboards and alerting',
    projects: ['Infrastructure Dashboards', 'SLO Tracking']
  },
  {
    name: 'Alertmanager',
    category: 'Observability',
    proficiency: 3,
    icon: <Monitor className="w-5 h-5" />,
    description: 'Alert routing and notification management',
    projects: ['Homelab Alerts', 'Incident Response']
  },
  {
    name: 'Uptime Kuma',
    category: 'Observability',
    proficiency: 4,
    icon: <Monitor className="w-5 h-5" />,
    description: 'Service uptime monitoring and status pages',
    projects: ['Service Health', 'Availability Tracking']
  },
  
  // IaC & Cloud
  {
    name: 'Terraform',
    category: 'IaC & Cloud',
    proficiency: 4,
    icon: <Cloud className="w-5 h-5" />,
    description: 'Infrastructure as code for cloud resources',
    projects: ['AWS Backend', 'Lambda Infrastructure']
  },
  {
    name: 'AWS',
    category: 'IaC & Cloud',
    proficiency: 4,
    icon: <Cloud className="w-5 h-5" />,
    description: 'Lambda, DynamoDB, API Gateway, EventBridge',
    projects: ['Lead Capture', 'Serverless Backend']
  },
  {
    name: 'GCP',
    category: 'IaC & Cloud',
    proficiency: 4,
    icon: <Cloud className="w-5 h-5" />,
    description: 'Professional Cloud Architect certified',
    projects: ['Cloud Architecture', 'GKE Deployments']
  },
  {
    name: 'Azure',
    category: 'IaC & Cloud',
    proficiency: 3,
    icon: <Cloud className="w-5 h-5" />,
    description: 'AKS cluster deployment and management',
    projects: ['AKS Cluster', 'Azure Infrastructure']
  },
  {
    name: 'Cloudflare',
    category: 'IaC & Cloud',
    proficiency: 4,
    icon: <Shield className="w-5 h-5" />,
    description: 'Tunnel, Zero Trust, DNS, edge security',
    projects: ['Homelab Ingress', 'Secure Access']
  },
  {
    name: 'Linux',
    category: 'IaC & Cloud',
    proficiency: 5,
    icon: <Code2 className="w-5 h-5" />,
    description: 'System administration and shell scripting',
    projects: ['Homelab Servers', 'Automation Scripts']
  },
  {
    name: 'Bash',
    category: 'IaC & Cloud',
    proficiency: 5,
    icon: <Code2 className="w-5 h-5" />,
    description: 'Shell scripting and automation',
    projects: ['Build Scripts', 'Infrastructure Setup']
  },
];

const categoryColors = {
  'Container Orchestration': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'CI/CD & GitOps': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  'Observability': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  'IaC & Cloud': 'bg-green-500/10 text-green-600 border-green-500/20'
};

const categoryIcons = {
  'Container Orchestration': <Container className="w-4 h-4" />,
  'CI/CD & GitOps': <GitBranch className="w-4 h-4" />,
  'Observability': <Monitor className="w-4 h-4" />,
  'IaC & Cloud': <Cloud className="w-4 h-4" />
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
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Proficiency</span>
              <ProficiencyBar level={skill.proficiency} />
            </div>
            
            <p className="text-xs text-muted-foreground line-clamp-1">
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

  const categories = ['Container Orchestration', 'CI/CD & GitOps', 'Observability', 'IaC & Cloud'] as const;

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
            <span className="hidden sm:inline">{category}</span>
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


    </div>
  );
}
