'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/Button';
import SectionHeader from '@/components/SectionHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Timeline } from '@/components/ui/timeline';
import { BentoGrid, TimelineBentoCard } from "@/components/ui/bento-grid";
import { siteConfig } from '@/config/site.config';
import { useContactModal } from '@/contexts/ContactModalContext';

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-blue-500/60 bg-background px-3 py-1 text-sm text-foreground shadow-sm shadow-blue-500/20">
      {children}
    </span>
  );
}



type ProjectStatus = 'Not Started' | 'In Progress' | 'Completed';

function StatusBadge({ status }: { status: ProjectStatus }) {
  const dotClass =
    status === 'Completed'
      ? 'bg-emerald-500'
      : status === 'In Progress'
      ? 'bg-amber-500'
      : 'bg-slate-400';

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-transparent px-3 py-1 text-xs font-semibold text-foreground/80 dark:border-slate-700">
      <span className={`h-2 w-2 rounded-full ${dotClass}`} />
      {status}
    </span>
  );
}

function ProjectCard({
  id,
  title,
  category,
  description,
  tags,
  status,
  href = '#',
  image,
  target,
}: {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  status: ProjectStatus;
  href?: string;
  image: string;
  target?: string;
}) {
  return (
    <Card id={id} className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover"
        />
      </div>
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{category}</CardDescription>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p>{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
        <div className="pt-2">
          <Button asChild>
            <Link href={href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined}>
              Read More
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const timelineData = [
  {
    id: "digital-marketing",
    title: "Digital Marketing → Technical Curiosity",
    content: (
      <div>
        <p className="mb-8 text-xs font-normal text-muted-foreground md:text-sm">
          Moved from campaigns to <strong>tracking, CRMs, and data</strong>.
        </p>
      </div>
    ),
  },
  {
    id: "automation-integrations",
    title: "Automation & Integrations",
    content: (
      <div>
        <p className="mb-8 text-xs font-normal text-muted-foreground md:text-sm">
          Built <strong>Zapier + API</strong> bridges; standardized onboarding;
          compliance-aware workflows.
        </p>
      </div>
    ),
  },
  {
    id: "ai-systems",
    title: "AI-Augmented Systems",
    content: (
      <div>
        <p className="mb-8 text-xs font-normal text-muted-foreground md:text-sm">
          Added <strong>chatbots and lead scoring</strong> to improve activation
          and support.
        </p>
      </div>
    ),
  },
  {
    id: "cloud-devops",
    title: "Cloud & DevOps",
    content: (
      <div>
        <p className="mb-8 text-xs font-normal text-muted-foreground md:text-sm">
          Building a <strong>Kubernetes-based</strong> home lab with{" "}
          <strong>observability</strong> and <strong>secure networking</strong>.
        </p>
        <BentoGrid className="grid-cols-1 auto-rows-[10rem] md:auto-rows-[12rem] lg:auto-rows-[15rem] md:grid-cols-2 gap-4">
            {[...Array(3)].map((_, i) => (
            <TimelineBentoCard
                key={`bento-card-${i}`}
                background={
                    <Image
                        src="/dalton-ousley-profile-pic.webp"
                        alt="Home Lab"
                        fill
                        className="object-cover rounded-xl"
                    />
                }
            />
            ))}
        </BentoGrid>
      </div>
    ),
  },
  {
    id: "full-stack",
    title: "Full-Stack Delivery",
    content: (
      <div>
        <p className="mb-8 text-xs font-normal text-muted-foreground md:text-sm">
          Shipping a <strong>Next.js</strong> platform with case studies and
          blogs.
        </p>
        <BentoGrid className="grid-cols-1 auto-rows-[10rem] md:auto-rows-[12rem] lg:auto-rows-[15rem] gap-4">
            <TimelineBentoCard
                background={
                    <Image
                        src="/dalton-ousley-profile-pic.webp"
                        alt="Home Lab"
                        fill
                        className="object-cover rounded-xl"
                    />
                }
            />
        </BentoGrid>
      </div>
    ),
  },
];

export default function ProjectsPage() {
  const { openContactModal } = useContactModal();
  
  return (
    <div className="relative w-full">
      {/* Hero / Intro */}
      <section>
        <div className="container mx-auto max-w-screen-2xl py-16 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[1.2fr_.8fr]">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary">Projects</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                This page showcases production-ready projects demonstrating <strong>AWS cloud architecture</strong>, <strong>infrastructure as code</strong>, 
                <strong> DevOps practices</strong>, and <strong>full-stack development</strong>. Each project emphasizes <strong>security-first design</strong>, 
                <strong> cost optimization</strong>, and <strong>operational excellence</strong>—aligned with roles like <strong>Cloud Engineer</strong>, 
                <strong> Solutions Architect</strong>, and <strong>Technical Account Manager (TAM)</strong>.
              </p>
              <blockquote className="mt-6 border-l-4 border-orange-500/60 pl-4 italic text-muted-foreground">
                <span className="font-semibold">Featured:</span> The Serverless Form Capture System below demonstrates end-to-end AWS architecture with 
                multi-layer security, event-driven design, and full IaC automation.
              </blockquote>
              <div className="mt-6 flex gap-3">
                <button 
                  onClick={openContactModal}
                  className="underline decoration-orange-500/60 decoration-2 underline-offset-4 hover:decoration-orange-500 transition-colors"
                >
                  Get in touch
                </button>
                <Link href={siteConfig.social.linkedin} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  LinkedIn
                </Link>
              </div>
            </div>
            <Card className="bg-card/60">
              <CardHeader>
                <CardTitle>Tech Stack Legend</CardTitle>
                <CardDescription>Common tools referenced across projects</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge>AWS Lambda</Badge>
                <Badge>API Gateway</Badge>
                <Badge>DynamoDB</Badge>
                <Badge>EventBridge</Badge>
                <Badge>CloudWatch</Badge>
                <Badge>Terraform</Badge>
                <Badge>Kubernetes</Badge>
                <Badge>Docker</Badge>
                <Badge>Next.js</Badge>
                <Badge>TypeScript</Badge>
                <Badge>Python</Badge>
                <Badge>SQL</Badge>
                <Badge>Grafana</Badge>
                <Badge>Prometheus</Badge>
                <Badge>n8n</Badge>
                <Badge>Zapier</Badge>
                <Badge>GoHighLevel</Badge>
                <Badge>HubSpot</Badge>
                <Badge>Webhooks</Badge>
                <Badge>Custom APIs</Badge>
                <Badge>LLMs</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Current Projects */}
      <section>
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Current Projects" subtitle="Modern, modular cards (image, tags, short blurb, metrics)" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ProjectCard
              id="aws-lead-capture"
              title="Serverless Form Capture System"
              category="Cloud Engineering"
              description="Production-ready event-driven serverless architecture on AWS with security best practices, IaC, and multi-layer protection."
              tags={["AWS Lambda", "DynamoDB", "API Gateway", "Terraform", "EventBridge", "WAF"]}
              status="Completed"
              href="/blog/react-form-aws-backend" target="_blank"
              image="/blog/images/aws-lead-capture-cloud-project-dalton-ousley.webp"
            />

            <ProjectCard
              id="home-lab"
              title="Personal Cloud Home Lab"
              category="Cloud & DevOps"
              description="Exploring production-style architecture on a personal scale."
              tags={["Kubernetes", "Grafana", "Prometheus", "n8n"]}
              status="In Progress"
              href="/projects#home-lab"
              image="/dalton-ousley-profile-pic.webp"
            />

            <ProjectCard
              id="ai-automation"
              title="AI & Automation Systems"
              category="Automation"
              description="Workflows combining CRMs, APIs, and LLMs to reduce manual work."
              tags={["GoHighLevel", "HubSpot", "Zapier", "LLMs"]}
              status="In Progress"
              href="/projects#ai-automation"
              image="/dalton-ousley-profile-pic.webp"
            />

            <ProjectCard
              id="portfolio-platform"
              title="Portfolio Platform"
              category="Full-Stack"
              description="Next.js portfolio for projects, case studies, and technical writing."
              tags={["Next.js", "TypeScript", "React", "SQL"]}
              status="Completed"
              href="/projects#portfolio-platform"
              image="/dalton-ousley-profile-pic.webp"
            />
          </div>
        </div>
      </section>

      {/* Metrics & Outcomes */}
      <section>
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Metrics & Outcomes" subtitle="Examples to model" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <ul className="list-disc space-y-2 pl-5 text-foreground/90">
                  <li>Onboarded <strong>1,500+ clients</strong> to SaaS platforms (reduced time-to-value).</li>
                  <li>Cut manual tasks with <strong>API + Zapier</strong> automations; improved data fidelity.</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <ul className="list-disc space-y-2 pl-5 text-foreground/90">
                  <li>Improved retention via <strong>customer-centric onboarding</strong> and training programs.</li>
                  <li>Shipped <strong>AI-assisted CRM features</strong> (lead scoring, chatbots) to increase activation.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Project Timeline */}
      <section className="pb-16 md:pb-24">
        <Timeline 
            data={timelineData}
            title="Project Timeline"
            description="How the work evolved"
        />
      </section>
    </div>
  );
}


