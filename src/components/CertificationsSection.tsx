"use client";

import React, { forwardRef, useRef } from 'react';
import SectionHeader from './SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BadgeCheck, CircleDashed, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedBeam } from '@/components/magicui/animated-beam';
import Image from 'next/image';
import PythonIcon from './icons/PythonIcon';
import JavaScriptIcon from './icons/JavaScriptIcon';
import ReactIcon from './icons/ReactIcon';
import GoogleCloudIcon from './icons/GoogleCloudIcon';
import KubernetesIcon from './icons/KubernetesIcon';
import LinuxIcon from './icons/LinuxIcon';

type Certification = {
    title: string;
    status: 'In Progress' | 'Completed';
    Icon: React.ElementType;
    progress?: number;
    link?: string;
    imageSrc?: string;
};

const certificationsData: Record<string, Certification> = {
    'pca': {
        title: 'Google Professional Cloud Architect',
        status: 'In Progress',
        Icon: GoogleCloudIcon,
        imageSrc: '/google_cloud-icon.svg',
        progress: 95,
    },
    'cka': {
        title: 'Certified Kubernetes Administrator',
        status: 'In Progress',
        Icon: KubernetesIcon,
        imageSrc: '/Kubernetes_logo_without_workmark.svg',
        progress: 15,
    },
    'lpic1': {
        title: 'LPIC-1: Linux Administrator',
        status: 'In Progress',
        Icon: LinuxIcon,
        imageSrc: '/linux.svg',
        progress: 15,
    },
    'seo': {
        title: 'Advanced SEO Certification',
        status: 'Completed',
        Icon: Search,
        link: 'https://www.linkedin.com/in/dalton-ousley/',
    },
    'python': {
        title: 'Python for Everybody Specialization',
        status: 'Completed',
        Icon: PythonIcon,
        link: 'https://www.linkedin.com/in/dalton-ousley/',
    },
    'javascript': {
        title: 'Modern JavaScript (ES6+)',
        status: 'Completed',
        Icon: JavaScriptIcon,
        link: 'https://www.linkedin.com/in/dalton-ousley/',
    },
    'react': {
        title: 'Meta Front-End Developer',
        status: 'Completed',
        Icon: ReactIcon,
        link: 'https://www.linkedin.com/in/dalton-ousley/',
    },
};

type CertificationNodeProps = {
    id: keyof typeof certificationsData;
    className?: string;
};

const CertificationNode = forwardRef<HTMLDivElement, CertificationNodeProps>(({ id, className = '' }, ref) => {
    const cert = certificationsData[id];
    if (!cert) return null;
    const { Icon, progress, link } = cert;
    const imageSrc = cert.imageSrc;
    const isInProgress = cert.status === 'In Progress';

    const content = (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.5 }}
            className={`group relative flex justify-center items-center ${className}`}
        >
            <Card className={`bg-background/80 backdrop-blur-sm border-border/40 w-full max-w-sm h-full transition-all duration-300 group-hover:border-primary/80 group-hover:scale-105 ${isInProgress ? 'border-dashed' : ''}`}>
                <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isInProgress ? (imageSrc ? '' : 'bg-amber-500/10 text-amber-500') : 'bg-primary/10 text-primary'}`}>
                            {imageSrc ? (
                                <Image src={imageSrc} alt={`${cert.title} logo`} width={24} height={24} className="w-6 h-6" />
                            ) : (
                                <Icon className="w-6 h-6" />
                            )}
                        </div>
                        <span className={`text-xs font-mono px-2 py-1 rounded-full ${isInProgress ? 'bg-amber-500/20 text-amber-600' : 'bg-primary/20 text-primary-foreground'}`}>
                            {cert.status}
                        </span>
                    </div>
                    <CardTitle className="text-lg">{cert.title}</CardTitle>
                </CardHeader>
                {isInProgress && progress !== undefined && (
                    <CardContent>
                        <div className="w-full bg-secondary/30 rounded-full h-2.5">
                            <motion.div
                                className="bg-amber-500 h-2.5 rounded-full"
                                initial={{ width: "0%" }}
                                whileInView={{ width: `${progress}%` }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                viewport={{ once: true, amount: 0.8 }}
                            />
                        </div>
                        <p className="text-right text-sm text-muted-foreground mt-1 font-mono">{progress}% complete</p>
                    </CardContent>
                )}
            </Card>
        </motion.div>
    );

    if (link) {
        return (
            <a href={link} target="_blank" rel="noopener noreferrer" className="w-full">
                {content}
            </a>
        );
    }

    return content;
});
CertificationNode.displayName = 'CertificationNode';


const CategoryNode = forwardRef<HTMLDivElement, { title: string, icon: React.ElementType }>(({ title, icon: Icon }, ref) => {
    return (
        <div ref={ref} className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-secondary/30 text-secondary-foreground rounded-full flex items-center justify-center mb-2 border-2 border-border/50">
                <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold tracking-wider">{title}</h3>
        </div>
    )
});
CategoryNode.displayName = 'CategoryNode';


export function CertificationsSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const inProgressRef = useRef<HTMLDivElement>(null);
    const completedRef = useRef<HTMLDivElement>(null);

    const pcaRef = useRef<HTMLDivElement>(null);
    const ckaRef = useRef<HTMLDivElement>(null);
    const lpic1Ref = useRef<HTMLDivElement>(null);
    const seoRef = useRef<HTMLDivElement>(null);
    const pythonRef = useRef<HTMLDivElement>(null);
    const javascriptRef = useRef<HTMLDivElement>(null);
    const reactRef = useRef<HTMLDivElement>(null);

    return (
        <section id="certifications" className="py-20 sm:py-32">
            <div className="container mx-auto px-4">
                <SectionHeader
                    title="cat /var/log/certifications.log"
                    subtitle="A timeline of my ongoing and completed technical certifications."
                />
                <div
                    className="relative mt-20 flex w-full flex-col items-center justify-center"
                    ref={containerRef}
                >
                    <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-16">
                        {/* In Progress Column */}
                        <div className="flex flex-col items-center gap-y-10">
                            <CategoryNode ref={inProgressRef} title="In Progress" icon={CircleDashed} />
                            <CertificationNode id="pca" ref={pcaRef} />
                            <CertificationNode id="cka" ref={ckaRef} />
                            <CertificationNode id="lpic1" ref={lpic1Ref} />
                        </div>

                        {/* Completed Column */}
                        <div className="flex flex-col items-center gap-y-10">
                            <CategoryNode ref={completedRef} title="Completed" icon={BadgeCheck} />
                            <CertificationNode id="seo" ref={seoRef} />
                            <CertificationNode id="python" ref={pythonRef} />
                            <CertificationNode id="javascript" ref={javascriptRef} />
                            <CertificationNode id="react" ref={reactRef} />
                        </div>
                    </div>

                    {/* Beams connecting categories to certifications */}
                    <AnimatedBeam containerRef={containerRef} fromRef={inProgressRef} toRef={pcaRef} duration={3} delay={0.5} pathOpacity={0.2} />
                    <AnimatedBeam containerRef={containerRef} fromRef={inProgressRef} toRef={ckaRef} duration={3} delay={0.7} pathOpacity={0.2} />
                    <AnimatedBeam containerRef={containerRef} fromRef={inProgressRef} toRef={lpic1Ref} duration={3} delay={0.9} pathOpacity={0.2} />
                    
                    <AnimatedBeam containerRef={containerRef} fromRef={completedRef} toRef={seoRef} duration={3} delay={0.6} pathOpacity={0.2} />
                    <AnimatedBeam containerRef={containerRef} fromRef={completedRef} toRef={pythonRef} duration={3} delay={0.8} pathOpacity={0.2} />
                    <AnimatedBeam containerRef={containerRef} fromRef={completedRef} toRef={javascriptRef} duration={3} delay={1.0} pathOpacity={0.2} />
                    <AnimatedBeam containerRef={containerRef} fromRef={completedRef} toRef={reactRef} duration={3} delay={1.2} pathOpacity={0.2} />
                </div>
            </div>
        </section>
    );
}
