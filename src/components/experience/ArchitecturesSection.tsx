"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Target, 
  GitBranch, 
  Shield, 
  Brain, 
  CheckCircle2
} from 'lucide-react';

import SectionHeader from '@/components/SectionHeader';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import ReactIcon from '@/components/icons/ReactIcon';

export default function ArchitecturesSection() {
  return (
    <section>
      <div className="container mx-auto max-w-screen-2xl py-16 px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Architectures in Production"
          subtitle="Systems I built or owned — with outcomes"
        />
        <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <BentoGridItem
            title="GKE + Istio Platform"
            description={
              <div className="space-y-3">
                <p>Blue/green rollouts, HPA, error-budget alerts. Cost down 22%.</p>
                <div className="flex gap-2 sm:gap-3 items-center text-xs flex-wrap">
                  <div className="flex items-center gap-1 bg-blue-500/10 px-1.5 sm:px-2 py-1 rounded border border-blue-500/20">
                    <Image src="/Kubernetes_logo_without_workmark.svg" alt="Kubernetes logo" width={14} height={14} className="sm:w-4 sm:h-4" />
                    <span className="text-blue-600 dark:text-blue-400 text-[10px] sm:text-xs">K8s</span>
                  </div>
                  <div className="flex items-center gap-1 bg-orange-500/10 px-1.5 sm:px-2 py-1 rounded border border-orange-500/20">
                    <Image src="/google_cloud-icon.svg" alt="Google Cloud logo" width={14} height={14} className="sm:w-4 sm:h-4" />
                    <span className="text-orange-600 dark:text-orange-400 text-[10px] sm:text-xs">GCP</span>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-500/10 px-1.5 sm:px-2 py-1 rounded border border-gray-500/20">
                    <Image src="/Linux.svg" alt="Linux logo" width={14} height={14} className="sm:w-4 sm:h-4" />
                    <span className="text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs">Linux</span>
                  </div>
                </div>
              </div>
            }
            header={
              <div className="relative h-24 w-full bg-gradient-to-br from-blue-500/10 via-green-500/10 to-purple-500/10 rounded-lg overflow-hidden border border-blue-500/20">
                {/* Kubernetes cluster visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-2 opacity-60">
                    {[...Array(9)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.3 }}
                        className="w-3 h-3 bg-blue-500/40 rounded border border-blue-500/60 shadow-sm"
                      />
                    ))}
                  </div>
                </div>
                <div className="absolute top-2 right-2 opacity-80">
                  <Image src="/Kubernetes_logo_without_workmark.svg" alt="Kubernetes logo" width={24} height={24} />
                </div>
                <div className="absolute bottom-2 left-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
                  Multi-region K8s
                </div>
              </div>
            }
          />
          <BentoGridItem
            title="CI/CD Pipeline"
            description={
              <div className="space-y-3">
                <p>Commit → build → test → deploy → observe. Lead time -70%.</p>
                <div className="flex gap-2 sm:gap-3 items-center text-xs flex-wrap">
                  <div className="flex items-center gap-1 bg-green-500/10 px-1.5 sm:px-2 py-1 rounded border border-green-500/20">
                    <GitBranch className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-green-600 dark:text-green-400 text-[10px] sm:text-xs">GitOps</span>
                  </div>
                  <div className="flex items-center gap-1 bg-cyan-500/10 px-1.5 sm:px-2 py-1 rounded border border-cyan-500/20">
                    <ReactIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-cyan-600 dark:text-cyan-400 text-[10px] sm:text-xs">React</span>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-500/10 px-1.5 sm:px-2 py-1 rounded border border-gray-500/20">
                    <Image src="/Linux.svg" alt="Linux logo" width={14} height={14} className="sm:w-4 sm:h-4" />
                    <span className="text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs">Linux</span>
                  </div>
                </div>
              </div>
            }
            header={
              <div className="relative h-24 w-full bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-lg overflow-hidden border border-green-500/20">
                {/* Pipeline flow visualization */}
                <div className="absolute inset-0 flex items-center justify-center pb-6">
                  <div className="flex items-center gap-1 flex-wrap justify-center">
                    {['Commit', 'Build', 'Test', 'Deploy'].map((stage, i) => (
                      <React.Fragment key={stage}>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.2, duration: 0.4 }}
                          className="bg-green-500/20 border border-green-500/40 rounded px-1.5 py-0.5 text-[10px] sm:text-xs text-green-600 dark:text-green-400 font-medium shadow-sm"
                        >
                          {stage}
                        </motion.div>
                        {i < 3 && (
                          <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: (i + 1) * 0.2, duration: 0.3 }}
                            className="w-1 sm:w-2 h-px bg-green-500/60 hidden sm:block"
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="absolute top-2 right-2 opacity-80">
                  <GitBranch className="h-6 w-6 text-green-500" />
                </div>
                <div className="absolute bottom-2 left-2 text-xs text-green-600 dark:text-green-400 font-medium">
                  Automated Pipeline
                </div>
              </div>
            }
          />
          <BentoGridItem
            title="1,500+ Clients Onboarded"
            description="Improved product adoption and reduced time-to-value for over 1,500 clients on SaaS platforms."
            header={
              <div className="relative h-24 w-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg overflow-hidden border border-green-500/20">
                {/* Growth chart visualization */}
                <div className="absolute inset-0 flex items-end justify-center p-4">
                  <div className="flex items-end gap-1 w-full max-w-20">
                    {[0.3, 0.5, 0.7, 0.4, 0.8, 0.9, 1.0].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height * 40}px` }}
                        transition={{ delay: i * 0.1 + 0.5, duration: 0.5 }}
                        className="bg-green-500/60 rounded-t flex-1 min-w-1 shadow-sm"
                      />
                    ))}
                  </div>
                </div>
                <div className="absolute top-2 right-2 opacity-80">
                  <Rocket className="h-6 w-6 text-green-500" />
                </div>
                <div className="absolute bottom-2 left-2 text-xs text-green-600 dark:text-green-400 font-medium">
                  Growth Metrics
                </div>
              </div>
            }
            className="md:col-span-1"
          />
          <BentoGridItem
            title="AI-Powered CRM"
            description="Built an AI-driven CRM with chatbots and automated lead scoring, reducing manual sales workload."
            header={
              <div className="relative h-24 w-full bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-lg overflow-hidden border border-purple-500/20">
                {/* AI network visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-2 border-purple-500/30 rounded-full"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-1 w-10 h-10 border border-pink-500/40 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="h-5 w-5 text-purple-500" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 text-xs text-purple-600 dark:text-purple-400 font-medium">
                  AI/ML Systems
                </div>
              </div>
            }
            className="md:col-span-1"
          />
          <BentoGridItem
            title="Automated Compliance"
            description="Engineered automated compliance workflows for health and life insurance industries."
            header={
              <div className="relative h-24 w-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg overflow-hidden border border-blue-500/20">
                {/* Shield with checkmarks */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <Shield className="h-10 w-10 text-blue-500 opacity-80" />
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                      className="absolute -top-1 -right-1"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7, duration: 0.3 }}
                      className="absolute -bottom-1 -left-1"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </motion.div>
                  </div>
                </div>
                {/* Compliance indicators */}
                <div className="absolute bottom-1 left-1 right-1">
                  <div className="flex justify-between text-[10px] sm:text-xs px-1">
                    <span className="text-green-600 dark:text-green-400 bg-black/20 dark:bg-white/20 px-1 rounded">HIPAA ✓</span>
                    <span className="text-green-600 dark:text-green-400 bg-black/20 dark:bg-white/20 px-1 rounded">SOC2 ✓</span>
                    <span className="text-green-600 dark:text-green-400 bg-black/20 dark:bg-white/20 px-1 rounded">PCI ✓</span>
                  </div>
                </div>
              </div>
            }
            className="md:col-span-1"
          />
          <BentoGridItem
            title="Improved Retention"
            description="Designed customer-centric onboarding strategies that significantly reduced churn."
            header={
              <div className="relative h-24 w-full bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg overflow-hidden border border-orange-500/20">
                {/* Target with arrow */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <Target className="h-10 w-10 text-orange-500 opacity-80" />
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                    </motion.div>
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 text-xs text-orange-600 dark:text-orange-400 font-medium">
                  Customer Success
                </div>
              </div>
            }
            className="md:col-span-1"
          />
        </BentoGrid>
      </div>
    </section>
  );
}
