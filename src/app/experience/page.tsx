import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Code2, Eye, Zap, RefreshCw, ShieldCheck, Server } from 'lucide-react';

import SectionHeader from '@/components/SectionHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import ExperienceHero from '@/components/experience/ExperienceHero';
import { Timeline } from '@/components/ui/timeline';
import { TerminalPhilosophy } from '@/components/TerminalPhilosophy';
import FeaturedProjectsSection from '@/components/experience/FeaturedProjectsSection';
import { ExperienceCTA } from '@/components/experience/ExperienceCTA';
import { posts } from '../../../.velite';
import { getProjectPosts, getFeaturedProjects } from '@/lib/projects';

// Dynamically import InteractiveSkillsGrid to reduce initial bundle size
// This component uses framer-motion and is below the fold
const InteractiveSkillsGrid = dynamic(
  () => import('@/components/InteractiveSkillsGrid').then(mod => ({ default: mod.InteractiveSkillsGrid })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-12">
        <div className="animate-pulse text-muted-foreground">Loading skills...</div>
      </div>
    ),
  }
);

export const metadata = {
  title: 'Experience — Dalton Ousley',
  description:
    'DevOps engineer with hands-on experience in Kubernetes, GitOps, cloud infrastructure, and automation. Discover my journey and technical expertise.',
};

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-blue-500/60 bg-background px-3 py-1 text-sm text-foreground shadow-sm shadow-blue-500/20 ${className}`}
    >
      {children}
    </span>
  );
}

export default function ExperiencePage() {
  // Get featured projects for the experience page
  const allProjects = getProjectPosts(posts);
  const featuredProjects = getFeaturedProjects(allProjects);
  
  const timelineData = [
    {
      id: 'foundations-learning-pivot',
      title: 'Foundations — Learning & Pivot',
      content: (
        <Card className="bg-card/60">
          <CardContent className="pt-6 space-y-3">
            <p className="text-sm text-muted-foreground"><strong>Problem</strong>: I wanted to move into Cloud/DevOps, but my experience and knowledge were scattered across IT, self-study, and side projects.</p>
            <p className="text-sm text-muted-foreground"><strong>Approach</strong>: Built a structured learning path around Linux, networking, containers, and scripting, with daily hands-on labs instead of just videos.</p>
            <p className="text-sm text-muted-foreground"><strong>Outcome</strong>: Strong fundamentals in Linux, the OSI model, and shell tooling—enough to debug real systems, not just pass quizzes.</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge className="bg-slate-500/10 border-slate-500/30 text-slate-300">Linux</Badge>
              <Badge className="bg-slate-500/10 border-slate-500/30 text-slate-300">Networking</Badge>
              <Badge className="bg-slate-500/10 border-slate-500/30 text-slate-300">Bash</Badge>
              <Badge className="bg-slate-500/10 border-slate-500/30 text-slate-300">Fundamentals</Badge>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: 'architect-mindset-google-pca',
      title: 'Architect Mindset — Google PCA',
      content: (
        <Card className="bg-card/60">
          <CardContent className="pt-6 space-y-3">
            <p className="text-sm text-muted-foreground"><strong>Problem</strong>: I needed more than "how to click in the console"—I wanted to understand how to design secure, scalable systems end-to-end.</p>
            <p className="text-sm text-muted-foreground"><strong>Approach</strong>: Went deep into Google Cloud architecture: IAM, networking, storage, and resilience patterns. Worked through case studies and built small reference architectures.</p>
            <p className="text-sm text-muted-foreground"><strong>Outcome</strong>: Passed the Google Professional Cloud Architect exam and gained confidence designing multi-tier, secure cloud solutions.</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge className="bg-blue-500/10 border-blue-500/30 text-blue-300">GCP</Badge>
              <Badge className="bg-blue-500/10 border-blue-500/30 text-blue-300">IAM</Badge>
              <Badge className="bg-blue-500/10 border-blue-500/30 text-blue-300">VPC</Badge>
              <Badge className="bg-blue-500/10 border-blue-500/30 text-blue-300">Architecture</Badge>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: 'platform-thinking-homelab-gitops',
      title: 'Platform Thinking — Homelab & GitOps',
      content: (
        <Card className="bg-card/60">
          <CardContent className="pt-6 space-y-3">
            <p className="text-sm text-muted-foreground"><strong>Problem</strong>: I wanted a place to experiment with "real" infrastructure—Kubernetes, GitOps, observability—without running up a massive cloud bill.</p>
            <p className="text-sm text-muted-foreground"><strong>Approach</strong>: Built a Proxmox-backed homelab running a multi-node k3s cluster, wired up GitOps with ArgoCD, storage, ingress, and monitoring.</p>
            <p className="text-sm text-muted-foreground"><strong>Outcome</strong>: Production-like environment where I run real services, practice upgrades, troubleshoot failures, and treat infra as code.</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge className="bg-purple-500/10 border-purple-500/30 text-purple-300">Kubernetes</Badge>
              <Badge className="bg-purple-500/10 border-purple-500/30 text-purple-300">k3s</Badge>
              <Badge className="bg-purple-500/10 border-purple-500/30 text-purple-300">GitOps</Badge>
              <Badge className="bg-purple-500/10 border-purple-500/30 text-purple-300">ArgoCD</Badge>
              <Badge className="bg-purple-500/10 border-purple-500/30 text-purple-300">Ansible</Badge>
              <Badge className="bg-purple-500/10 border-purple-500/30 text-purple-300">Proxmox</Badge>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: 'product-thinking-real-applications',
      title: 'Product Thinking — Building Real Applications',
      content: (
        <Card className="bg-card/60">
          <CardContent className="pt-6 space-y-3">
            <p className="text-sm text-muted-foreground"><strong>Problem</strong>: I needed to demonstrate end-to-end ownership—from design and development to deployment and operations—across diverse technical stacks.</p>
            <p className="text-sm text-muted-foreground"><strong>Approach</strong>: Built and deployed production applications including an AI-powered knowledge management system, serverless lead capture with AWS Lambda/DynamoDB, and a task management platform—each showcasing different cloud-native patterns.</p>
            <p className="text-sm text-muted-foreground"><strong>Outcome</strong>: Portfolio of working applications that demonstrate my ability to design, build, deploy, and operate real products end-to-end across multiple cloud platforms.</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-300">AWS</Badge>
              <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-300">GCP</Badge>
              <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-300">Serverless</Badge>
              <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-300">IaC</Badge>
              <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-300">CI/CD</Badge>
            </div>
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <div className="relative w-full">
      <ExperienceHero
        heading="Designing resilient cloud platforms that ship faster and fail safer"
        subheading="Outcome-driven work across DevOps, cloud infrastructure, and platform engineering — positioned for DevOps Engineer and Cloud Engineer roles."
      />

      {/* Why DevOps */}
      <section className="section-padding">
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Why DevOps?"
            subtitle="From building products to building the platforms that power them"
          />
          <div className="max-w-4xl mx-auto text-center text-foreground/90 space-y-4">
            <p>
            After years of building applications and solving technical problems, I realized my passion lies in the infrastructure layer—the systems that enable teams to ship faster, fail safer, and scale reliably.
            </p>
            <p>
            I'm drawn to DevOps because it combines my love for automation, system design, and operational excellence. Whether it's designing CI/CD pipelines, implementing observability, or managing Kubernetes clusters, I thrive on making infrastructure invisible so teams can focus on delivering value.
            </p>
            <p>
            My homelab isn't just a learning environment—it's where I practice the same disciplines I want to bring to a production team: GitOps workflows, infrastructure as code, monitoring, and continuous improvement.
            </p>
          </div>
        </div>
      </section>
      
      {/* Featured Projects */}
      <FeaturedProjectsSection projects={featuredProjects} />

      {/* DevOps Journey Timeline */}
      <section className="section-padding">
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <Timeline
            title="My DevOps Journey"
            description="From scattered knowledge to production-ready cloud infrastructure"
            data={timelineData}
          />
        </div>
      </section>

      {/* Interactive Skills Grid */}
      <section className="section-padding">
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Technical Skills"
            subtitle="Core competencies for DevOps and cloud engineering roles"
          />
          <InteractiveSkillsGrid />
        </div>
      </section>

      {/* Terminal Philosophy */}
      <section className="section-padding">
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
                title="Development Philosophy"
                subtitle="My approach to building systems that work in the real world"
            />
            <TerminalPhilosophy />
        </div>
      </section>

      {/* Operating Principles */}
      <section className="section-padding">
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Operating Principles"
            subtitle="The convictions that shape how I build and operate infrastructure"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="bg-card/60">
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center p-3 rounded-lg bg-background/50 text-blue-500 dark:text-blue-400 mb-3">
                  <Code2 className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Everything as Code</h3>
                <p className="text-sm text-muted-foreground">
                  If it can&apos;t be reviewed in a PR, it doesn&apos;t exist. Infrastructure, configuration, and pipelines are versioned, auditable, and repeatable.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/60">
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center p-3 rounded-lg bg-background/50 text-emerald-500 dark:text-emerald-400 mb-3">
                  <Eye className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Observability First</h3>
                <p className="text-sm text-muted-foreground">
                  A system you can&apos;t see inside isn&apos;t reliable — it&apos;s just lucky. Metrics, logs, and traces are requirements, not enhancements.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/60">
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center p-3 rounded-lg bg-background/50 text-yellow-500 dark:text-yellow-400 mb-3">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Automate the Toil, Own the Complexity</h3>
                <p className="text-sm text-muted-foreground">
                  Automation isn&apos;t an escape from understanding. Know what your pipelines are doing and why.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/60">
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center p-3 rounded-lg bg-background/50 text-orange-500 dark:text-orange-400 mb-3">
                  <RefreshCw className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Recover Faster Than You Fail</h3>
                <p className="text-sm text-muted-foreground">
                  MTTR matters more than MTBF. Design for recovery, not just prevention. Runbooks, rollbacks, and chaos testing aren&apos;t optional.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/60">
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center p-3 rounded-lg bg-background/50 text-violet-500 dark:text-violet-400 mb-3">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Security Is Day One</h3>
                <p className="text-sm text-muted-foreground">
                  Retrofitting security is expensive and painful. RBAC, secrets management, and network policies belong in the initial design, not the last sprint.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/60">
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center p-3 rounded-lg bg-background/50 text-cyan-500 dark:text-cyan-400 mb-3">
                  <Server className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Treat the Homelab Like Production</h3>
                <p className="text-sm text-muted-foreground">
                  The habits built in low-stakes environments follow you into high-stakes ones. Real runbooks, real monitoring, real discipline.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <ExperienceCTA />

    </div>
  );
}
