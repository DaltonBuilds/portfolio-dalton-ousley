import React from 'react';
import Link from 'next/link';
import { Briefcase, Zap, Rocket, Target, Code } from 'lucide-react';

import SectionHeader from '@/components/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import ExperienceHero from '@/components/experience/ExperienceHero';
import { Timeline } from '@/components/ui/timeline';
import { CommandCenterDashboard } from '@/components/CommandCenterDashboard';
import { InteractiveSkillsGrid } from '@/components/InteractiveSkillsGrid';
import { TerminalPhilosophy } from '@/components/TerminalPhilosophy';
import ArchitecturesSection from '@/components/experience/ArchitecturesSection';

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

const roles = [
    {
      title: 'Software Solutions Architect',
      company: 'CleanCore',
      icon: <Rocket className="h-6 w-6 text-primary" />,
      description: 'Architected AI-powered CRM systems and led client onboarding programs.',
      items: [
        'Architected AI-powered CRM systems with automated lead scoring & chatbots',
        'Collaborated on custom engineered fixes & enhancements',
        'Reduced churn by designing effective onboarding programs',
      ],
    },
    {
      title: 'Systems & Technology Consultant',
      company: 'Pioneering Clean',
      icon: <Zap className="h-6 w-6 text-primary" />,
      description: 'Developed an LMS platform and improved user adoption through UX enhancements.',
      items: [
        'Developed a full-scale online learning management platform (LMS)',
        'Integrated payment gateways & course hosting solutions',
        'Led UX enhancements to refine user flows & boost adoption',
      ],
    },
    {
      title: 'Entrepreneur & Freelancer',
      company: 'Self-Employed',
      icon: <Briefcase className="h-6 w-6 text-primary" />,
      description: 'Delivered CRM automation and API integrations for clients in regulated industries.',
      items: [
        'Delivered CRM automation & SaaS onboarding for regulated industries',
        'Designed Zapier and custom automation workflows',
        'Provided technical training & documentation for business teams',
      ],
    },
  ];



export default function ExperiencePage() {
  const timelineData = [
    {
      title: 'Software Solutions Architect — CleanCore',
      content: (
        <Card className="bg-card/60">
          <CardContent className="pt-6 space-y-3">
            <p className="text-sm text-muted-foreground"><strong>Problem</strong>: Fragmented customer onboarding and limited visibility into funnel performance.</p>
            <p className="text-sm text-muted-foreground"><strong>Approach</strong>: Designed an AI-powered CRM with event-driven automation, rolled out CI/CD and observability.</p>
            <p className="text-sm text-muted-foreground"><strong>Outcome</strong>: 1,500+ clients onboarded, churn reduced, lead time -70%.</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge>GCP</Badge>
              <Badge>CI/CD</Badge>
              <Badge>Observability</Badge>
              <Badge>APIs</Badge>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      title: 'Systems & Technology Consultant — Pioneering Clean',
      content: (
        <Card className="bg-card/60">
          <CardContent className="pt-6 space-y-3">
            <p className="text-sm text-muted-foreground"><strong>Problem</strong>: Need for scalable LMS with reliable payments and content delivery.</p>
            <p className="text-sm text-muted-foreground"><strong>Approach</strong>: Built modular LMS, integrated gateways, optimized UX and release flow.</p>
            <p className="text-sm text-muted-foreground"><strong>Outcome</strong>: Adoption up, incidents down; release cadence increased safely.</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge>React</Badge>
              <Badge>Payments</Badge>
              <Badge>Blue/Green</Badge>
              <Badge>Metrics</Badge>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      title: 'Entrepreneur & Freelancer — Self-Employed',
      content: (
        <Card className="bg-card/60">
          <CardContent className="pt-6 space-y-3">
            <p className="text-sm text-muted-foreground"><strong>Problem</strong>: Regulated clients needed secure automation and reliable integrations.</p>
            <p className="text-sm text-muted-foreground"><strong>Approach</strong>: Automated CRM and data pipelines, enforced IAM/RBAC, added alerting.</p>
            <p className="text-sm text-muted-foreground"><strong>Outcome</strong>: Compliance workflows automated; fewer manual errors and faster SLAs.</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge>IAM</Badge>
              <Badge>APIs</Badge>
              <Badge>Zapier</Badge>
              <Badge>Docs</Badge>
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
        subheading="Outcome-driven work across Cloud, DevOps, and Platform Engineering — positioned for TAM, Cloud Engineer, or Solutions Architect roles."
        stats={[
          { label: 'Availability', value: '99.95%' },
          { label: 'MTTR Reduction', value: '-63%' },
          { label: 'Deploys/Day', value: '×10' },
          { label: 'Cost Reduction', value: '-27%' },
        ]}
      />

      {/* Professional Background */}
      <section>
        <div className="container mx-auto max-w-screen-2xl px-6 md:px-10 py-16">
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
      
      {/* Roles & Contributions */}
      <section>
        <div className="container mx-auto max-w-screen-2xl px-6 md:px-10 py-16">
          <SectionHeader
            title="Roles & Contributions"
            subtitle="Hands-on experience in diverse technical roles"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <Card key={role.title} className="flex flex-col">
                <CardHeader className="flex-row items-start gap-4 space-y-0">
                    {role.icon}
                    <div className="flex-1">
                        <CardTitle>{role.title}</CardTitle>
                        <CardDescription>{role.company}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="list-disc list-inside space-y-2 text-sm text-foreground/80">
                    {role.items.map((item, index) => <li key={index}>{item}</li>)}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
            {/* Architecture Highlights (Bento) */}
      <ArchitecturesSection />

      {/* Experience Timeline */}
      <section>
        <div className="container mx-auto max-w-screen-2xl px-6 md:px-10 py-16">
          <Timeline
            title="Impact Over Time"
            description="Problem → approach → outcome across roles"
            data={timelineData}
          />
        </div>
      </section>

      {/* Career Goals */}
      <section >
        <div className="container mx-auto max-w-screen-2xl px-6 md:px-10 py-16">
          <SectionHeader
            title="Career Goals"
            subtitle="Targeting roles that leverage my unique skill set"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <Card>
                <CardContent className="pt-6">
                    <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="text-lg font-semibold">Technical Account Manager</h3>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="pt-6">
                    <Code className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="text-lg font-semibold">Cloud Engineer</h3>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="pt-6">
                    <Briefcase className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="text-lg font-semibold">Solutions Architect</h3>
                </CardContent>
            </Card>
          </div>
          <p className="mt-6 text-center text-muted-foreground max-w-3xl mx-auto">
            These roles allow me to combine my customer-first mindset, cloud and DevOps expertise, and automation experience to deliver business impact at scale.
          </p>
        </div>
      </section>

      {/* Command Center Dashboard */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto max-w-screen-2xl px-6 md:px-10 py-16">
          <SectionHeader
            title="Mission Control Center"
            subtitle="Real-time monitoring and management of enterprise cloud infrastructure"
          />
          <CommandCenterDashboard />
        </div>
      </section>

      {/* Interactive Skills Grid */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto max-w-screen-2xl px-6 md:px-10 py-16">
          <SectionHeader
            title="Skills & Expertise"
            subtitle="Interactive skill showcase with proficiency levels and project experience"
          />
          <InteractiveSkillsGrid />
        </div>
      </section>

      {/* Terminal Philosophy */}
      <section>
        <div className="container mx-auto max-w-screen-2xl px-6 md:px-10 py-16">
            <SectionHeader
                title="Development Philosophy"
                subtitle="My approach to building systems that work in the real world"
            />
            <TerminalPhilosophy />
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto max-w-screen-2xl px-6 md:px-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary">Design review or migration chat?</h2>
          <p className="mt-4 text-lg text-muted-foreground">TAM, Cloud Engineer, or Solutions Architect — I can help accelerate outcomes.</p>
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
