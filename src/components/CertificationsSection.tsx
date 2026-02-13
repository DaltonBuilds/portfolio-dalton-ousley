"use client";

import React, { forwardRef, useRef } from 'react';
import SectionHeader from './SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BadgeCheck, CircleDashed, Clock, CheckCircle2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import GoogleCloudIcon from './icons/GoogleCloudIcon';
import KubernetesIcon from './icons/KubernetesIcon';
import LinuxIcon from './icons/LinuxIcon';
import CredlyBadge from './CredlyBadge';

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
        status: 'Completed',
        Icon: GoogleCloudIcon,
        imageSrc: '/google_cloud-icon.svg',
        link: 'https://www.linkedin.com/in/dalton-ousley/',
    },
    'cka': {
        title: 'Certified Kubernetes Administrator',
        status: 'In Progress',
        Icon: KubernetesIcon,
        imageSrc: '/Kubernetes_logo_without_workmark.svg',
        progress: 65,
    },
    'lpic1': {
        title: 'LPIC-1: Linux Administrator',
        status: 'In Progress',
        Icon: LinuxIcon,
        imageSrc: '/Linux.svg',
        progress: 30,
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
    const isPCA = id === 'pca';

    const cardContent = (
        <Card className={`bg-background/80 backdrop-blur-sm border-border/40 w-80 h-full transition-all duration-300 group-hover:border-primary/80 group-hover:scale-105 ${isInProgress ? 'border-dashed' : ''}`}>
            <CardHeader>
                <div className="flex justify-between items-center mb-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isInProgress ? (imageSrc ? '' : 'bg-amber-500/10 text-amber-500') : 'bg-primary/10 text-primary'}`}>
                        {imageSrc ? (
                            <Image src={imageSrc} alt={`${cert.title} logo`} width={24} height={24} className="w-6 h-6" />
                        ) : (
                            <Icon className="w-6 h-6" />
                        )}
                    </div>
                    <span className={`text-xs font-mono px-2 py-1 rounded-full ${isInProgress ? 'bg-amber-500/20 text-amber-600' : 'bg-green-500/20 text-green-600'}`}>
                        {cert.status}
                    </span>
                </div>
                <CardTitle className="text-lg">{cert.title}</CardTitle>
            </CardHeader>
            {isPCA && (
                <CardContent className="flex justify-center pb-4">
                    <CredlyBadge 
                        width={90}
                        height={90}
                        disableLink={!!link}
                    />
                </CardContent>
            )}
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
    );

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.5 }}
            className={`group relative flex justify-center items-center ${className}`}
        >
            {link ? (
                <a href={link} target="_blank" rel="noopener noreferrer" className="w-full">
                    {cardContent}
                </a>
            ) : (
                cardContent
            )}
        </motion.div>
    );
});
CertificationNode.displayName = 'CertificationNode';


const CategoryNode = forwardRef<HTMLDivElement, { title: string, icon: React.ElementType, colorClass?: string }>(({ title, icon: Icon, colorClass = 'text-secondary-foreground' }, ref) => {
    return (
        <div ref={ref} className="flex flex-col items-center justify-center text-center">
            <div className={`w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mb-2 border-2 border-border/50 ${colorClass}`}>
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

    return (
        <section id="certifications" className="section-padding">
            <div className="container mx-auto px-4">
                <SectionHeader
                    title="Certifications"
                    subtitle="Cloud and infrastructure certifications focused on production-ready skills"
                    command="cat /var/log/certifications.log"
                    className="px-4"
                />
                
                {/* Glassmorphism container with tree connectors */}
                <div className="mt-12 glass rounded-2xl p-8 md:p-12 border border-primary/20 shadow-2xl shadow-primary/5 relative">

                    
                    <div
                        className="relative flex w-full flex-col items-center justify-center"
                        ref={containerRef}
                    >
                        <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-16">
                            {/* In Progress Column */}
                            <div className="flex flex-col items-center gap-y-10 relative">
                                <div className="relative">
                                    <CategoryNode ref={inProgressRef} title="In Progress" icon={Clock} colorClass="text-amber-500" />
                                    {/* Vertical line down from category - hidden on mobile */}
                                    <div className="hidden md:block absolute left-1/2 top-full w-0.5 h-10 bg-orange-500 -translate-x-1/2" aria-hidden="true"></div>
                                </div>
                                <div className="relative">
                                    <CertificationNode id="cka" ref={ckaRef} />
                                    {/* Vertical connector to next card */}
                                    <div className="hidden md:block absolute left-1/2 top-full w-0.5 h-10 bg-orange-500 -translate-x-1/2" aria-hidden="true"></div>
                                </div>
                                <CertificationNode id="lpic1" ref={lpic1Ref} />
                            </div>

                            {/* Completed Column */}
                            <div className="flex flex-col items-center gap-y-10 relative">
                                <div className="relative">
                                    <CategoryNode ref={completedRef} title="Completed" icon={CheckCircle2} colorClass="text-green-500" />
                                    {/* Vertical line down from category - hidden on mobile */}
                                    <div className="hidden md:block absolute left-1/2 top-full w-0.5 h-10 bg-orange-500 -translate-x-1/2" aria-hidden="true"></div>
                                </div>
                                <CertificationNode id="pca" ref={pcaRef} />
                            </div>
                        </div>

                        {/* Planned Certifications Section */}
                        <div className="w-full mt-16 pt-12 border-t border-border/40">
                            <div className="flex items-center justify-center gap-2 mb-8">
                                <Calendar className="w-5 h-5 text-blue-500" />
                                <h3 className="text-xl font-semibold text-muted-foreground">Planned</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="bg-background/60 backdrop-blur-sm border-border/30 border-dashed hover:border-primary/40 transition-all duration-300 hover:scale-105">
                                        <CardContent className="pt-6 pb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                                    <Image src="/Kubernetes_logo_without_workmark.svg" alt="CKAD logo" width={20} height={20} className="w-5 h-5" />
                                                </div>
                                                <p className="font-semibold text-sm">CKAD</p>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-2">Certified Kubernetes Application Developer</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="bg-background/60 backdrop-blur-sm border-border/30 border-dashed hover:border-primary/40 transition-all duration-300 hover:scale-105">
                                        <CardContent className="pt-6 pb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                                    <Image src="/Kubernetes_logo_without_workmark.svg" alt="CKS logo" width={20} height={20} className="w-5 h-5" />
                                                </div>
                                                <p className="font-semibold text-sm">CKS</p>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-2">Certified Kubernetes Security Specialist</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="bg-background/60 backdrop-blur-sm border-border/30 border-dashed hover:border-primary/40 transition-all duration-300 hover:scale-105">
                                        <CardContent className="pt-6 pb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                                    <Image src="/Kubernetes_logo_without_workmark.svg" alt="KCNA logo" width={20} height={20} className="w-5 h-5" />
                                                </div>
                                                <p className="font-semibold text-sm">KCNA</p>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-2">Kubernetes and Cloud Native Associate</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="bg-background/60 backdrop-blur-sm border-border/30 border-dashed hover:border-primary/40 transition-all duration-300 hover:scale-105">
                                        <CardContent className="pt-6 pb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                                    <Image src="/Kubernetes_logo_without_workmark.svg" alt="KCSA logo" width={20} height={20} className="w-5 h-5" />
                                                </div>
                                                <p className="font-semibold text-sm">KCSA</p>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-2">Kubernetes and Cloud Native Security Associate</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
