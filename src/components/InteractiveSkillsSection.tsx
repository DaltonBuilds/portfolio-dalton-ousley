"use client";

import React from 'react';
import SectionHeader from './SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { GitBranch, Shield, ShipWheel, Cloud, Settings, BrainCircuit, Monitor, Brain } from 'lucide-react';

const skillsData = {
    'ci-cd': {
        title: 'GitOps & CI/CD',
        description: 'ArgoCD for GitOps deployments, GitHub Actions for CI/CD pipelines. Everything version-controlled and automated.',
        category: 'DevOps',
        Icon: GitBranch,
        iconColor: 'text-blue-500 dark:text-blue-400',
        iconBg: 'bg-gradient-to-br from-blue-500/20 to-blue-600/10',
        categoryBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        borderColor: 'border-blue-500/30',
    },
    'iac': {
        title: 'Infrastructure as Code',
        description: 'Terraform for AWS infrastructure. Learning to manage infrastructure through code with proper state management.',
        category: 'IaC',
        Icon: Settings,
        iconColor: 'text-purple-500 dark:text-purple-400',
        iconBg: 'bg-gradient-to-br from-purple-500/20 to-purple-600/10',
        categoryBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
        borderColor: 'border-purple-500/30',
    },
    'multi-cloud': {
        title: 'Multi-Cloud Architecture',
        description: 'AWS backend infrastructure, GCP Professional Cloud Architect certified, working on Azure AKS deployments.',
        category: 'Cloud',
        Icon: Cloud,
        iconColor: 'text-sky-500 dark:text-sky-400',
        iconBg: 'bg-gradient-to-br from-sky-500/20 to-sky-600/10',
        categoryBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
        borderColor: 'border-sky-500/30',
    },
    'orchestration': {
        title: 'Kubernetes & Orchestration',
        description: 'Running a 3-node k3s cluster with MetalLB, ingress controllers, and persistent storage. Learning production patterns.',
        category: 'Infrastructure',
        Icon: ShipWheel,
        iconColor: 'text-cyan-500 dark:text-cyan-400',
        iconBg: 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/10',
        categoryBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
        borderColor: 'border-cyan-500/30',
    },
    'sre': {
        title: 'Site Reliability Engineering',
        description: 'Learning SRE principles through homelab operations: monitoring, alerting, incident response, and building for reliability.',
        category: 'SRE',
        Icon: BrainCircuit,
        iconColor: 'text-emerald-500 dark:text-emerald-400',
        iconBg: 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10',
        categoryBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        borderColor: 'border-emerald-500/30',
    },
    'observability': {
        title: 'Observability Stack',
        description: 'Prometheus and Grafana for metrics and dashboards. Learning to monitor systems and troubleshoot issues effectively.',
        category: 'Monitoring',
        Icon: Monitor,
        iconColor: 'text-amber-500 dark:text-amber-400',
        iconBg: 'bg-gradient-to-br from-amber-500/20 to-amber-600/10',
        categoryBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        borderColor: 'border-amber-500/30',
    },
    'mlops': {
        title: 'AI/ML Operations',
        description: 'Exploring MLOps patterns and model deployment infrastructure. Interested in the intersection of ML and platform engineering.',
        category: 'AI/ML',
        Icon: Brain,
        iconColor: 'text-pink-500 dark:text-pink-400',
        iconBg: 'bg-gradient-to-br from-pink-500/20 to-pink-600/10',
        categoryBg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
        borderColor: 'border-pink-500/30',
    },
    'security': {
        title: 'Security & Compliance',
        description: 'Cloudflare Zero Trust for secure access, learning security best practices and policy enforcement in Kubernetes.',
        category: 'Security',
        Icon: Shield,
        iconColor: 'text-red-500 dark:text-red-400',
        iconBg: 'bg-gradient-to-br from-red-500/20 to-red-600/10',
        categoryBg: 'bg-red-500/10 text-red-600 dark:text-red-400',
        borderColor: 'border-red-500/30',
    },
};

type SkillId = keyof typeof skillsData;

const SkillCard: React.FC<{ id: SkillId; showConnector?: boolean }> = ({ id, showConnector = true }) => {
    const skill = skillsData[id];
    if (!skill) return null;
    const { Icon, iconColor, iconBg, categoryBg, borderColor } = skill;

    return (
        <div className="relative">
            {/* Vertical connector line from above */}
            {showConnector && (
                <div className="hidden lg:block absolute left-1/2 -top-4 w-0.5 h-4 bg-orange-500 -translate-x-1/2" aria-hidden="true"></div>
            )}
            
            <Card className={`glass border-2 ${borderColor} h-full transition-all duration-300 hover:border-primary/60 hover:scale-105 hover:shadow-xl hover:shadow-primary/10`}>
                <CardHeader>
                    <div className="flex justify-between items-center mb-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} transition-transform duration-300 hover:scale-110`}>
                            <Icon className={`w-6 h-6 ${iconColor}`} />
                        </div>
                        <span className={`text-xs font-mono px-3 py-1.5 rounded-full ${categoryBg} font-medium`}>{skill.category}</span>
                    </div>
                    <CardTitle className="text-lg font-semibold">{skill.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="leading-relaxed">{skill.description}</CardDescription>
                </CardContent>
            </Card>
        </div>
    );
};

export function InteractiveSkillsSection() {
    return (
        <section id="skills" className="py-20 sm:py-32">
            <div className="container mx-auto px-4">
                <SectionHeader
                    title="Skills"
                    subtitle="DevOps and cloud infrastructure skills built through hands-on homelab work and real projects"
                    command="./skills --list --verbose"
                />
                
                <div className="relative mt-20 max-w-7xl mx-auto">
                    {/* Three-column layout with tree structure */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
                        
                        {/* Horizontal connector line spanning all three columns - hidden on mobile */}
                        <div className="hidden lg:block absolute top-[1.75rem] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent" aria-hidden="true"></div>
                        
                        {/* Left Column: Foundation */}
                        <div className="space-y-4 relative">
                            <div className="text-center mb-4 relative">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide relative inline-block">
                                    Foundation
                                </h3>
                                {/* Vertical line down - hidden on mobile */}
                                <div className="hidden lg:block absolute left-1/2 top-full w-0.5 h-4 bg-orange-500 -translate-x-1/2" aria-hidden="true"></div>
                            </div>
                            
                            <SkillCard id="iac" />
                            <SkillCard id="ci-cd" showConnector={true} />
                            <SkillCard id="security" showConnector={true} />
                        </div>

                        {/* Middle Column: Core Infrastructure */}
                        <div className="space-y-4 relative">
                            <div className="text-center mb-4 relative">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide relative inline-block">
                                    Core Infrastructure
                                </h3>
                                {/* Vertical line down - hidden on mobile */}
                                <div className="hidden lg:block absolute left-1/2 top-full w-0.5 h-4 bg-orange-500 -translate-x-1/2" aria-hidden="true"></div>
                            </div>

                            <SkillCard id="orchestration" />
                            <SkillCard id="multi-cloud" showConnector={true} />
                        </div>

                        {/* Right Column: Operations & Emerging */}
                        <div className="space-y-4 relative">
                            <div className="text-center mb-4 relative">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                    Operations & Emerging
                                </h3>
                                {/* Vertical line down - hidden on mobile */}
                                <div className="hidden lg:block absolute left-1/2 top-full w-0.5 h-4 bg-orange-500 -translate-x-1/2" aria-hidden="true"></div>
                            </div>

                            <SkillCard id="observability" />
                            <SkillCard id="sre" showConnector={true} />
                            <SkillCard id="mlops" showConnector={true} />
                        </div>
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="mt-12 flex flex-wrap justify-center gap-2">
                        {[
                            { label: "Kubernetes", color: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300" },
                            { label: "ArgoCD", color: "bg-blue-500/10 border-blue-500/30 text-blue-300" },
                            { label: "Terraform", color: "bg-purple-500/10 border-purple-500/30 text-purple-300" },
                            { label: "AWS", color: "bg-orange-500/10 border-orange-500/30 text-orange-300" },
                            { label: "GCP", color: "bg-sky-500/10 border-sky-500/30 text-sky-300" },
                            { label: "Prometheus", color: "bg-amber-500/10 border-amber-500/30 text-amber-300" },
                            { label: "Grafana", color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" },
                            { label: "GitHub Actions", color: "bg-blue-500/10 border-blue-500/30 text-blue-300" },
                        ].map((tech) => (
                            <span
                                key={tech.label}
                                className={`inline-flex items-center rounded-md border px-3 py-1 text-xs font-medium ${tech.color}`}
                            >
                                {tech.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
