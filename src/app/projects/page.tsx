import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';
import { Button } from '@/components/ui/Button';
import SectionHeader from '@/components/SectionHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export const metadata = {
  title: 'Projects | Dalton Ousley — Cloud, Automation, DevOps',
  description:
    'Cloud & DevOps projects, CRM automation, API integrations, and full-stack builds by Dalton Ousley. Kubernetes, Next.js, Python, SQL, Grafana, Prometheus, n8n, Zapier.',
  alternates: {
    canonical: 'https://daltonousley.com/projects',
  },
  openGraph: {
    title: 'Dalton Ousley — Projects',
    description: 'Selected work across cloud engineering, automation, and full-stack development.',
    url: 'https://daltonousley.com/projects',
    type: 'website',
  },
};

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-blue-500/60 bg-background px-3 py-1 text-sm text-foreground shadow-sm shadow-blue-500/20">
      {children}
    </span>
  );
}

const statusBadgeVariants = cva(
  'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold',
  {
    variants: {
      status: {
        Completed:
          'text-emerald-700 border-emerald-400 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-700',
        'In Progress':
          'text-amber-800 border-amber-400 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-700',
        'Not Started':
          'text-slate-700 border-slate-400 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      },
    },
    defaultVariants: {
      status: 'Not Started',
    },
  }
);

const statusDotVariants = cva('h-2 w-2 rounded-full', {
  variants: {
    status: {
      Completed: 'bg-emerald-500',
      'In Progress': 'bg-amber-500',
      'Not Started': 'bg-slate-400',
    },
  },
  defaultVariants: {
    status: 'Not Started',
  },
});

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
}: {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  status: ProjectStatus;
  href?: string;
  image: string;
}) {
  return (
    <Card id={id} className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image src={image} alt={title} layout="fill" objectFit="cover" />
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
            <Link href={href}>Read More</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TimelineItem({ title, period, children }: { title: string; period?: string; children: React.ReactNode }) {
  return (
    <li className="relative pl-6">
      <span className="absolute left-0 top-2 h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_0_3px] shadow-orange-500/20" />
      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold text-primary">{title}</p>
        {period && <p className="text-sm text-muted-foreground">{period}</p>}
        <div className="text-foreground/90">{children}</div>
      </div>
    </li>
  );
}

const TIMELINE = [
  {
    period: 'Phase 1',
    title: 'Marketing → Technical Foundations',
    keywords: ['tracking', 'CRMs', 'analytics'],
    highlights: ['Implemented tracking code', 'Learned CRM data models', 'Bridged marketing <> engineering'],
  },
  {
    period: 'Phase 2',
    title: 'Automation & Integrations',
    keywords: ['Zapier', 'APIs', 'compliance'],
    highlights: ['Standardized onboarding flows', 'Built API/webhook bridges', 'Introduced auditability'],
  },
  {
    period: 'Phase 3',
    title: 'AI-Augmented Systems',
    keywords: ['LLMs', 'chatbots', 'lead scoring'],
    highlights: ['Automated triage', 'Faster time-to-first-response', 'Improved activation'],
  },
  {
    period: 'Phase 4',
    title: 'Cloud & DevOps',
    keywords: ['Kubernetes', 'observability', 'VPN'],
    highlights: ['K8s cluster in home lab', 'Grafana/Prometheus dashboards', 'Secure remote networking'],
  },
  {
    period: 'Phase 5',
    title: 'Full-Stack Delivery',
    keywords: ['Next.js', 'TypeScript', 'SQL'],
    highlights: ['Portfolio & case studies', 'Reusable UI patterns', 'SEO-aware content'],
  },
];

export default function ProjectsPage() {
  return (
    <div className="relative w-full">
      {/* Hero / Intro */}
      <section>
        <div className="container mx-auto max-w-screen-2xl px-6 md:px-10 py-16 md:py-20">
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[1.2fr_.8fr]">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">Projects</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                This page highlights selected projects across <strong>cloud engineering</strong>, <strong>DevOps</strong>, <strong>automation</strong>, and
                <strong> full-stack development</strong>. Each project is chosen for its <strong>real-world impact</strong>, <strong>technical depth</strong>, and
                alignment with roles like <strong>Technical Account Manager (TAM)</strong>, <strong>Cloud Engineer</strong>, and <strong>Solutions Architect</strong>.
              </p>
              <blockquote className="mt-6 border-l-4 border-orange-500/60 pl-4 italic text-muted-foreground">
                <span className="font-semibold">Tip:</span> Scan the Categories to filter quickly, or jump into the Timeline to see how my work has evolved.
              </blockquote>
              <div className="mt-6 flex gap-3">
                <Link href="mailto:example@gmail.com" className="underline decoration-orange-500/60 decoration-2 underline-offset-4">
                  Get in touch
                </Link>
                <Link href="https://www.linkedin.com/in/dalton-ousley/" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
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
        <div className="container mx-auto max-w-screen-2xl px-6 md:px-10">
          <SectionHeader title="Current Projects" subtitle="Modern, modular cards (image, tags, short blurb, metrics)" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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

      {/* Past Projects */}
      <section>
        <div className="container mx-auto max-w-screen-2xl px-6 md:px-10">
          <SectionHeader title="Past Projects" subtitle="Brief case studies coming with screenshots & diagrams" />
          <Card>
            <CardContent className="pt-6">
              <ul className="list-disc space-y-2 pl-5 text-foreground/90">
                <li>
                  <strong>CRM Implementation & Onboarding</strong> — Deployed automation in GHL & Zapier; supported
                  <strong> 1,500+ client onboardings</strong>; built adoption playbooks.
                </li>
                <li>
                  <strong>LMS Development</strong> — Launched a learning platform with <strong>payment gateway</strong> integration; improved learner UX and course analytics.
                </li>
                <li>
                  <strong>AI-Powered CRM Chatbot</strong> — Automated lead scoring and triage; reduced manual workload for sales; increased time-to-first-response.
                </li>
                <li>
                  <strong>Compliance Automation</strong> — Designed workflows for <strong>health & life insurance</strong>; aligned with policy requirements and audit trails.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Project Categories */}
      <section>
        <div className="container mx-auto max-w-screen-2xl px-6 md:px-10">
          <SectionHeader title="Project Categories" subtitle="Quick filters for exploration" />
          <div className="flex flex-wrap gap-3">
            <Badge>Cloud & DevOps</Badge>
            <Badge>Automation</Badge>
            <Badge>Full-Stack</Badge>
            <Badge>AI & Emerging Tech</Badge>
          </div>
        </div>
      </section>

      {/* Case Studies Coming Soon */}
      <section>
        <div className="container mx-auto max-w-screen-2xl px-6 md:px-10">
          <SectionHeader title="Case Studies (Coming Soon)" subtitle="Problem → constraints → architecture → implementation → impact → lessons" />
          <Card>
            <CardContent className="pt-6">
              <p className="text-foreground/90">
                I’ll be publishing short, high-signal write-ups including architecture diagrams (Mermaid/SVG), before/after metrics,
                stack badges, and risks & mitigations. Where possible, I’ll reference open-source components used.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Metrics & Outcomes */}
      <section>
        <div className="container mx-auto max-w-screen-2xl px-6 md:px-10">
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
        <div className="container mx-auto max-w-screen-2xl px-6 md:px-10">
          <SectionHeader title="Project Timeline" subtitle="Narrative + machine-readable data" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Narrative</CardTitle>
                <CardDescription>How the work evolved</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ol className="relative space-y-8 border-l border-blue-500/40 pl-6">
                  <TimelineItem title="Digital Marketing → Technical Curiosity">
                    Moved from campaigns to <strong>tracking, CRMs, and data</strong>.
                  </TimelineItem>
                  <TimelineItem title="Automation & Integrations">
                    Built <strong>Zapier + API</strong> bridges; standardized onboarding; compliance-aware workflows.
                  </TimelineItem>
                  <TimelineItem title="AI-Augmented Systems">
                    Added <strong>chatbots and lead scoring</strong> to improve activation and support.
                  </TimelineItem>
                  <TimelineItem title="Cloud & DevOps">
                    Building a <strong>Kubernetes-based</strong> home lab with <strong>observability</strong> and <strong>secure networking</strong>.
                  </TimelineItem>
                  <TimelineItem title="Full-Stack Delivery">
                    Shipping a <strong>Next.js</strong> platform with case studies and blogs.
                  </TimelineItem>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Machine-Readable Data</CardTitle>
                <CardDescription>Can be consumed by UI components</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <pre className="whitespace-pre-wrap break-words text-sm text-muted-foreground">{JSON.stringify({ timeline: TIMELINE }, null, 2)}</pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}


