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
    },
    'iac': {
        title: 'Infrastructure as Code',
        description: 'Terraform, Crossplane, Pulumi for immutable infrastructure and automated provisioning.',
        category: 'Automation',
        Icon: Settings,
    },
    'multi-cloud': {
        title: 'Multi-Cloud Architecture',
        description: 'AWS, GCP, Azure expertise with hybrid cloud strategies and cloud-agnostic solutions.',
        category: 'Cloud',
        Icon: Cloud,
    },
    'orchestration': {
        title: 'Kubernetes & Orchestration',
        description: 'K8s cluster management, service mesh, auto-scaling, and cloud-native application deployment.',
        category: 'Infrastructure',
        Icon: ShipWheel,
    },
    'sre': {
        title: 'Site Reliability Engineering',
        description: 'Building resilient systems with 99.9% uptime, chaos engineering, and automated incident response.',
        category: 'SRE',
        Icon: BrainCircuit,
    },
    'observability': {
        title: 'Observability Stack',
        description: 'Prometheus, Grafana, Jaeger, OpenTelemetry for full-stack monitoring and distributed tracing.',
        category: 'Monitoring',
        Icon: Monitor,
    },
    'mlops': {
        title: 'AI/ML Operations',
        description: 'MLOps with Kubeflow, MLflow, model serving with BentoML, and vector database management.',
        category: 'AI/ML',
        Icon: Brain,
    },
    'security': {
        title: 'Security & Compliance',
        description: 'Zero-trust architecture, policy-as-code, vulnerability scanning with Falco, Trivy, and OPA.',
        category: 'Security',
        Icon: Shield,
    },
};

type SkillNodeProps = {
    id: keyof typeof skillsData;
    className?: string;
};

const SkillNode = forwardRef<HTMLDivElement, SkillNodeProps>(({ id, className = '' }, ref) => {
    const skill = skillsData[id];
    if (!skill) return null;
    const { Icon } = skill;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.5 }}
            className={`group relative flex justify-center items-center ${className}`}
        >
            <Card className="bg-background/80 backdrop-blur-sm border-border/40 w-full max-w-sm h-full transition-all duration-300 group-hover:border-primary/80 group-hover:scale-105">
                <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                            <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-mono bg-secondary/20 text-secondary-foreground px-2 py-1 rounded-full">{skill.category}</span>
                    </div>
                    <CardTitle className="text-lg">{skill.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription>{skill.description}</CardDescription>
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
                    className="relative mt-20 flex w-full items-center justify-center"
                    ref={containerRef}
                >
                    <div className="grid w-full grid-cols-1 gap-y-12 md:grid-cols-4 md:gap-x-8">
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

                    {/* Directed chain + one governance link (behind cards) */}
                    <AnimatedBeam containerRef={containerRef} fromRef={iacRef} toRef={ciCdRef} curvature={-40} duration={5.2} delay={0.15} pathOpacity={0.18} pathWidth={2} />
                    <AnimatedBeam containerRef={containerRef} fromRef={ciCdRef} toRef={orchestrationRef} curvature={-40} duration={5.6} delay={0.3} pathOpacity={0.18} pathWidth={2} />
                    <AnimatedBeam containerRef={containerRef} fromRef={orchestrationRef} toRef={multiCloudRef} curvature={-40} duration={6.0} delay={0.45} pathOpacity={0.18} pathWidth={2} />
                    <AnimatedBeam containerRef={containerRef} fromRef={orchestrationRef} toRef={sreRef} curvature={60} duration={6.2} delay={0.6} pathOpacity={0.18} pathWidth={2} />
                    <AnimatedBeam containerRef={containerRef} fromRef={orchestrationRef} toRef={observabilityRef} curvature={40} duration={5.8} delay={0.7} pathOpacity={0.18} pathWidth={2} />
                    <AnimatedBeam containerRef={containerRef} fromRef={orchestrationRef} toRef={mlopsRef} curvature={40} duration={5.8} delay={0.8} pathOpacity={0.18} pathWidth={2} />
                    <AnimatedBeam containerRef={containerRef} fromRef={securityRef} toRef={ciCdRef} curvature={60} duration={5.0} delay={0.1} pathOpacity={0.16} pathWidth={2} />
                </div>
            </div>
        </section>
    );
}
