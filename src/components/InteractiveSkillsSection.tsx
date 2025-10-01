"use client";

import React, { forwardRef, useRef } from 'react';
import SectionHeader from './SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { GitBranch, Shield, ShipWheel, Cloud, Settings, BrainCircuit, Monitor, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedBeam } from '@/components/magicui/animated-beam';

const skillsData = {
    'ci-cd': {
        title: 'GitOps & CI/CD',
        description: 'ArgoCD, Flux, Tekton pipelines with automated testing, security scanning, and progressive deployments.',
        category: 'DevOps',
        Icon: GitBranch,
        iconColor: 'text-blue-500 dark:text-blue-400',
        iconBg: 'bg-gradient-to-br from-blue-500/20 to-blue-600/10',
        categoryBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    'iac': {
        title: 'Infrastructure as Code',
        description: 'Terraform, Crossplane, Pulumi for immutable infrastructure and automated provisioning.',
        category: 'IaC',
        Icon: Settings,
        iconColor: 'text-purple-500 dark:text-purple-400',
        iconBg: 'bg-gradient-to-br from-purple-500/20 to-purple-600/10',
        categoryBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
    'multi-cloud': {
        title: 'Multi-Cloud Architecture',
        description: 'AWS, GCP, Azure expertise with hybrid cloud strategies and cloud-agnostic solutions.',
        category: 'Cloud',
        Icon: Cloud,
        iconColor: 'text-sky-500 dark:text-sky-400',
        iconBg: 'bg-gradient-to-br from-sky-500/20 to-sky-600/10',
        categoryBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    },
    'orchestration': {
        title: 'Kubernetes & Orchestration',
        description: 'K8s cluster management, service mesh, auto-scaling, and cloud-native application deployment.',
        category: 'Infrastructure',
        Icon: ShipWheel,
        iconColor: 'text-cyan-500 dark:text-cyan-400',
        iconBg: 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/10',
        categoryBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    },
    'sre': {
        title: 'Site Reliability Engineering',
        description: 'Building resilient systems with 99.9% uptime, chaos engineering, and automated incident response.',
        category: 'SRE',
        Icon: BrainCircuit,
        iconColor: 'text-emerald-500 dark:text-emerald-400',
        iconBg: 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10',
        categoryBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    'observability': {
        title: 'Observability Stack',
        description: 'Prometheus, Grafana, Jaeger, OpenTelemetry for full-stack monitoring and distributed tracing.',
        category: 'Monitoring',
        Icon: Monitor,
        iconColor: 'text-amber-500 dark:text-amber-400',
        iconBg: 'bg-gradient-to-br from-amber-500/20 to-amber-600/10',
        categoryBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    'mlops': {
        title: 'AI/ML Operations',
        description: 'MLOps with Kubeflow, MLflow, model serving with BentoML, and vector database management.',
        category: 'AI/ML',
        Icon: Brain,
        iconColor: 'text-pink-500 dark:text-pink-400',
        iconBg: 'bg-gradient-to-br from-pink-500/20 to-pink-600/10',
        categoryBg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
    },
    'security': {
        title: 'Security & Compliance',
        description: 'Zero-trust architecture, policy-as-code, vulnerability scanning with Falco, Trivy, and OPA.',
        category: 'Security',
        Icon: Shield,
        iconColor: 'text-red-500 dark:text-red-400',
        iconBg: 'bg-gradient-to-br from-red-500/20 to-red-600/10',
        categoryBg: 'bg-red-500/10 text-red-600 dark:text-red-400',
    },
};

type SkillNodeProps = {
    id: keyof typeof skillsData;
    className?: string;
};

const SkillNode = forwardRef<HTMLDivElement, SkillNodeProps>(({ id, className = '' }, ref) => {
    const skill = skillsData[id];
    if (!skill) return null;
    const { Icon, iconColor, iconBg, categoryBg } = skill;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.5 }}
            className={`group relative flex justify-center items-center z-10 ${className}`}
        >
            <Card className="relative bg-background/95 backdrop-blur-md border-border/50 w-full max-w-sm h-full transition-all duration-300 group-hover:border-primary/60 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-primary/10">
                <CardHeader>
                    <div className="flex justify-between items-center mb-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
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
        </motion.div>
    );
});
SkillNode.displayName = 'SkillNode';


export function InteractiveSkillsSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const ciCdRef = useRef<HTMLDivElement>(null);
    const iacRef = useRef<HTMLDivElement>(null);
    const multiCloudRef = useRef<HTMLDivElement>(null);
    const orchestrationRef = useRef<HTMLDivElement>(null);
    const sreRef = useRef<HTMLDivElement>(null);
    const securityRef = useRef<HTMLDivElement>(null);
    const observabilityRef = useRef<HTMLDivElement>(null);
    const mlopsRef = useRef<HTMLDivElement>(null);

    return (
        <section id="skills" className="py-20 sm:py-32">
            <div className="container mx-auto px-4">
                <SectionHeader
                    title="Skills"
                    subtitle="A comprehensive arsenal of modern DevOps, SRE, and AI/ML infrastructure tools"
                    command="./skills --list --verbose"
                />
                <div
                    className="relative mt-20 flex w-full items-center justify-center overflow-visible"
                    ref={containerRef}
                >
                    {/* Animated beams layer - rendered first but with z-index control */}
                    <div className="absolute inset-0 z-0">
                        <AnimatedBeam 
                            containerRef={containerRef} 
                            fromRef={iacRef} 
                            toRef={ciCdRef} 
                            curvature={-40} 
                            duration={5.2} 
                            delay={0.15} 
                            pathOpacity={0.2} 
                            pathWidth={2}
                            gradientStartColor="#a855f7"
                            gradientStopColor="#3b82f6"
                        />
                        <AnimatedBeam 
                            containerRef={containerRef} 
                            fromRef={ciCdRef} 
                            toRef={orchestrationRef} 
                            curvature={-40} 
                            duration={5.6} 
                            delay={0.3} 
                            pathOpacity={0.2} 
                            pathWidth={2}
                            gradientStartColor="#3b82f6"
                            gradientStopColor="#06b6d4"
                        />
                        <AnimatedBeam 
                            containerRef={containerRef} 
                            fromRef={orchestrationRef} 
                            toRef={multiCloudRef} 
                            curvature={-40} 
                            duration={6.0} 
                            delay={0.45} 
                            pathOpacity={0.2} 
                            pathWidth={2}
                            gradientStartColor="#06b6d4"
                            gradientStopColor="#0ea5e9"
                        />
                        <AnimatedBeam 
                            containerRef={containerRef} 
                            fromRef={orchestrationRef} 
                            toRef={sreRef} 
                            curvature={60} 
                            duration={6.2} 
                            delay={0.6} 
                            pathOpacity={0.2} 
                            pathWidth={2}
                            gradientStartColor="#06b6d4"
                            gradientStopColor="#10b981"
                        />
                        <AnimatedBeam 
                            containerRef={containerRef} 
                            fromRef={orchestrationRef} 
                            toRef={observabilityRef} 
                            curvature={40} 
                            duration={5.8} 
                            delay={0.7} 
                            pathOpacity={0.2} 
                            pathWidth={2}
                            gradientStartColor="#06b6d4"
                            gradientStopColor="#f59e0b"
                        />
                        <AnimatedBeam 
                            containerRef={containerRef} 
                            fromRef={orchestrationRef} 
                            toRef={mlopsRef} 
                            curvature={40} 
                            duration={5.8} 
                            delay={0.8} 
                            pathOpacity={0.2} 
                            pathWidth={2}
                            gradientStartColor="#06b6d4"
                            gradientStopColor="#ec4899"
                        />
                        <AnimatedBeam 
                            containerRef={containerRef} 
                            fromRef={securityRef} 
                            toRef={ciCdRef} 
                            curvature={60} 
                            duration={5.0} 
                            delay={0.1} 
                            pathOpacity={0.22} 
                            pathWidth={2.5}
                            gradientStartColor="#ef4444"
                            gradientStopColor="#3b82f6"
                        />
                    </div>

                    {/* Cards grid - rendered on top with z-10 from SkillNode */}
                    <div className="relative z-10 grid w-full grid-cols-1 gap-y-12 md:grid-cols-4 md:gap-x-8">
                        {/* Top row: Security overseeing pipelines */}
                        <div className="md:col-span-1"></div>
                        <div className="md:col-span-2 flex justify-center">
                            <SkillNode id="security" ref={securityRef} />
                        </div>
                        <div className="md:col-span-1"></div>

                        {/* Middle row: left-to-right flow */}
                        <div className="flex justify-center md:col-span-1">
                            <SkillNode id="iac" ref={iacRef} />
                        </div>
                        <div className="flex justify-center md:col-span-1">
                            <SkillNode id="ci-cd" ref={ciCdRef} />
                        </div>
                        <div className="flex justify-center md:col-span-1">
                            <SkillNode id="orchestration" ref={orchestrationRef} />
                        </div>
                        <div className="flex justify-center md:col-span-1">
                            <SkillNode id="multi-cloud" ref={multiCloudRef} />
                        </div>

                        {/* Bottom row: outcomes and adjacent specialties */}
                        <div className="flex justify-center md:col-span-1">
                           <SkillNode id="observability" ref={observabilityRef} />
                        </div>
                        <div className="flex justify-center md:col-span-1">
                           <SkillNode id="sre" ref={sreRef} />
                        </div>
                        <div className="flex justify-center md:col-span-1">
                           <SkillNode id="mlops" ref={mlopsRef} />
                        </div>
                        <div className="md:col-span-1"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
