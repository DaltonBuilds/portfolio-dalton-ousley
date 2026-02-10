import React from 'react';
import Link from 'next/link';
import { Cloud, GitBranch } from 'lucide-react';

import SectionHeader from '@/components/SectionHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import ExperienceHero from '@/components/experience/ExperienceHero';
import { Timeline } from '@/components/ui/timeline';
import { CommandCenterDashboard } from '@/components/CommandCenterDashboard';
import { InteractiveSkillsGrid } from '@/components/InteractiveSkillsGrid';
import { TerminalPhilosophy } from '@/components/TerminalPhilosophy';
import ArchitecturesSection from '@/components/experience/ArchitecturesSection';
import FeaturedProjectsSection from '@/components/experience/FeaturedProjectsSection';
import { posts } from '../../../.velite';
import { getProjectPosts, getFeaturedProjects } from '@/lib/projects';

export const metadata = {
  title: 'Experience — Dalton Ousley',
  description:
    '5+ years of experience in cloud, DevOps, automation, and full-stack development. Discover my career journey, accomplishments, and skills.',
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
        stats={[
          { label: 'Availability', value: '99.95%' },
          { label: 'MTTR Reduction', value: '-63%' },
          { label: 'Deploys/Day', value: '×10' },
          { label: 'Cost Reduction', value: '-27%' },
        ]}
      />

      {/* Professional Background */}
      <section>
        <div className="container mx-auto max-w-screen-2xl py-16 px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Professional Background"
            subtitle="Bridging business needs with technical execution"
          />
          <Card className="bg-card/60">
            <CardContent className="pt-6 text-foreground/90 space-y-4">
                <p>
                With 5+ years of experience as an entrepreneur, freelancer, and technical consultant, I’ve helped organizations implement solutions in cloud infrastructure, SaaS automation, and API integrations. My work has spanned compliance-heavy industries like health and life insurance, as well as SaaS startups.
                </p>
                <p>
                I thrive in cross-functional environments, collaborating with engineers, compliance officers, and business stakeholders to deliver solutions that are scalable, secure, and user-friendly.
                </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Featured Projects */}
      <FeaturedProjectsSection projects={featuredProjects} />
      
            {/* Architecture Highlights (Bento) */}
      <ArchitecturesSection />

      {/* DevOps Journey Timeline */}
      <section>
        <div className="container mx-auto max-w-screen-2xl py-16 px-4 sm:px-6 lg:px-8">
          <Timeline
            title="My DevOps Journey"
            description="From scattered knowledge to production-ready cloud infrastructure"
            data={timelineData}
          />
        </div>
      </section>

      {/* Career Goals */}
      <section >
        <div className="container mx-auto max-w-screen-2xl py-16 px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Career Goals"
            subtitle="Targeting roles that leverage my unique skill set"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center max-w-2xl mx-auto">
            <Card>
                <CardContent className="pt-6">
                    <GitBranch className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="text-lg font-semibold">DevOps Engineer</h3>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="pt-6">
                    <Cloud className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="text-lg font-semibold">Cloud Engineer</h3>
                </CardContent>
            </Card>
          </div>
          <p className="mt-6 text-center text-muted-foreground max-w-3xl mx-auto">
            These roles leverage my expertise in cloud infrastructure, automation, and reliability engineering to build scalable systems that deliver business value and operational excellence.
          </p>
        </div>
      </section>

      {/* Command Center Dashboard */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto max-w-screen-2xl py-16 px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Mission Control Center"
            subtitle="Real-time monitoring and management of enterprise cloud infrastructure"
          />
          <CommandCenterDashboard />
        </div>
      </section>

      {/* Interactive Skills Grid */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto max-w-screen-2xl py-16 px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Skills & Expertise"
            subtitle="Interactive skill showcase with proficiency levels and project experience"
          />
          <InteractiveSkillsGrid />
        </div>
      </section>

      {/* Terminal Philosophy */}
      <section>
        <div className="container mx-auto max-w-screen-2xl py-16 px-4 sm:px-6 lg:px-8">
            <SectionHeader
                title="Development Philosophy"
                subtitle="My approach to building systems that work in the real world"
            />
            <TerminalPhilosophy />
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto max-w-screen-2xl text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-primary">Design review or migration chat?</h2>
          <p className="mt-4 text-lg text-muted-foreground">DevOps Engineer or Cloud Engineer — I can help accelerate outcomes.</p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="mailto:example@gmail.com">Request a review</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/about">See how I work</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
