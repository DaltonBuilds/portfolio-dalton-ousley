import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'About — Dalton Ousley',
  description:
    'Learn about Dalton Ousley — a technologist blending DevOps, cloud, and customer success to build practical solutions.',
};

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-blue-500/60 bg-background px-3 py-1 text-sm text-foreground shadow-sm shadow-blue-500/20">
      {children}
    </span>
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

function StackIcon({ label, src }: { label: string; src?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-foreground/80">
      {src ? (
        <Image src={src} alt={label} width={28} height={28} className="h-7 w-7 md:h-8 md:w-8" />
      ) : (
        <span className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-md border border-blue-500/40 bg-background text-xs font-bold text-blue-400">
          TS
        </span>
      )}
      <span className="text-sm">{label}</span>
    </span>
  );
}

function TerminalWidget() {
  return (
    <div className="mt-8 w-full max-w-3xl md:max-w-4xl overflow-hidden rounded-lg border border-blue-500/50 bg-[#0b1220] text-gray-200 shadow-xl shadow-blue-500/20">
      <div className="flex items-center justify-between border-b border-blue-500/30 bg-[#0d1526] px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs text-blue-200/70 truncate">dalton@homelab:~</span>
      </div>
      <div className="px-2 sm:px-4 py-3 font-mono text-xs sm:text-[13px] md:text-sm overflow-x-auto">
        <div className="text-blue-300 whitespace-nowrap">$ kubectl get pods -n observability</div>
        <pre className="mt-1 text-blue-100/90 text-xs overflow-x-auto whitespace-pre">NAME                        READY   STATUS    RESTARTS   AGE
grafana-6c9dbbd666-ck9v2   1/1     Running   0          3d
prometheus-768b9b9f7c-z2s4q 2/2     Running   1          3d</pre>
        <div className="mt-3 text-blue-300 whitespace-nowrap">$ helm ls -n automation</div>
        <pre className="mt-1 text-blue-100/90 text-xs overflow-x-auto whitespace-pre">NAME    NAMESPACE   REVISION  UPDATED             STATUS   CHART
n8n     automation  4         2025-01-01 12:00    deployed n8n-0.21.0</pre>
        <div className="mt-3 text-blue-300 whitespace-nowrap">$ terraform plan</div>
        <pre className="mt-1 text-green-300/90 text-xs overflow-x-auto whitespace-pre">Plan: 3 to add, 0 to change, 0 to destroy</pre>
        <div className="mt-3 flex items-center gap-2 text-orange-300">
          <span className="text-blue-200/70 truncate">dalton@homelab</span>
          <span className="text-blue-200/50">$</span>
          <span className="inline-block h-4 w-1 bg-blue-100 animate-blink" />
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="relative w-full">

        <div className="container mx-auto max-w-screen-2xl py-16 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1.1fr_.9fr]">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary">
                About Dalton Ousley
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Technologist focused on DevOps, cloud, and customer success — bringing
                automation, observability, and practical engineering to business outcomes.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="https://www.linkedin.com/in/dalton-ousley/" target="_blank" rel="noreferrer">
                  <Button variant="secondary">Connect on LinkedIn</Button>
                </Link>
                <Link href="mailto:example@gmail.com">
                  <Button variant="outline">Email Dalton</Button>
                </Link>
              </div>
              <TerminalWidget />
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <div className="absolute -inset-2 rounded-xl bg-gradient-to-tr from-orange-500/40 to-blue-500/40 blur-xl" />
                <Image
                  src="/dalton-ousley-profile-pic.webp"
                  alt="Dalton Ousley portrait"
                  width={240}
                  height={240}
                  className="relative z-10 rounded-xl border border-blue-500/50 shadow-xl shadow-blue-500/20"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Stack icons */}
          <div className="mt-12">
            <p className="text-xs uppercase tracking-widest ">Tooling comfort zone</p>
            <div className="mt-3 flex flex-wrap items-center gap-6 text-muted-foreground opacity-90">
              <StackIcon label="Kubernetes" src="/Kubernetes_logo_without_workmark.svg" />
              <StackIcon label="GCP" src="/google_cloud-icon.svg" />
              <StackIcon label="Linux" src="/Linux.svg" />
              <StackIcon label="Python" src="/Python-logo-notext.svg" />
              <StackIcon label="React" src="/React-icon.svg" />
              <StackIcon label="TypeScript" src="/TypeScript.svg" />
            </div>
          </div>
        </div>

      {/* Introduction */}
      <section>
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Introduction"
            subtitle="A cross-functional path from marketing to solutions engineering"
          />
          <Card className="bg-card/60">
            <CardContent className="pt-6">
              <p className="text-foreground/90">
                Hi, I’m <strong>Dalton Ousley</strong> — a technologist with a background in entrepreneurship,
                freelancing, and technical consulting. Over the past 5+ years, I’ve helped clients solve complex
                problems through <strong>automation, integrations, and custom technical solutions</strong>.
              </p>
              <p className="mt-4 text-foreground/90">
                I started in digital marketing, but quickly discovered my passion for the technical side of things —
                from CRMs and APIs to workflows, compliance, and cloud systems. Today, I’m pursuing a career that blends
                <strong> technical depth with customer success</strong>, aiming to become a <strong>Technical Account Manager, Cloud Engineer,
                or Solutions Architect</strong>.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Career Journey */}
      <section>
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Career Journey" subtitle="Hands-on delivery across roles and industries" />
          <Card>
            <CardContent className="pt-6">
              <ol className="relative space-y-8 border-l border-blue-500/40 pl-6">
                <TimelineItem title="Entrepreneur & Freelancer" period="2018–Present">
                  <p>
                    Built a client base by providing CRM implementations, automation workflows, and cross-functional
                    technical support. Worked extensively with <strong>GoHighLevel, Zapier, custom APIs, and SaaS tools</strong>.
                  </p>
                </TimelineItem>
                <TimelineItem title="Technical Consultant & Solutions Architect">
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>Designed AI-powered CRM systems with automated lead scoring and chatbot integrations.</li>
                    <li>Reduced churn through custom onboarding and product adoption programs.</li>
                    <li>Led UX improvements by working closely with stakeholders and developers.</li>
                  </ul>
                </TimelineItem>
                <TimelineItem title="Cross-Functional Collaboration">
                  <p>
                    Partnered with engineering teams to secure API access, develop custom components, and meet
                    compliance requirements (including regulated industries like health & life insurance).
                  </p>
                </TimelineItem>
              </ol>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Skills & Expertise */}
      <section>
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Skills & Expertise" subtitle="Breadth across the stack with a DevOps core" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Programming & Dev</CardTitle>
                <CardDescription>Languages, frameworks, and platforms</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge>JavaScript</Badge>
                <Badge>TypeScript</Badge>
                <Badge>Python</Badge>
                <Badge>SQL</Badge>
                <Badge>React</Badge>
                <Badge>Next.js</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Automation & SaaS</CardTitle>
                <CardDescription>Enablement and system glue</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge>GoHighLevel</Badge>
                <Badge>HubSpot</Badge>
                <Badge>Zapier</Badge>
                <Badge>Custom APIs</Badge>
                <Badge>Webhooks</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Cloud & DevOps</CardTitle>
                <CardDescription>Shipping reliable systems</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge>Kubernetes (K8s)</Badge>
                <Badge>Docker</Badge>
                <Badge>Grafana</Badge>
                <Badge>Prometheus</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Other Strengths</CardTitle>
                <CardDescription>People and process</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge>Technical Training</Badge>
                <Badge>Customer Onboarding</Badge>
                <Badge>Workflow Design</Badge>
                <Badge>Compliance Consulting</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Current Projects */}
      <section>
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Current Projects" subtitle="Learning by building and operating" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Home Lab</CardTitle>
                <CardDescription>Cloud-hosted, Kubernetes-centric environment</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Hosting n8n for automation flows and AI Agents</li>
                  <li>Configuring VPN networking for secure remote work</li>
                  <li>Implementing observability with Grafana & Prometheus</li>
                  <li>Developing custom apps and API integrations</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Portfolio & Case Studies</CardTitle>
                <CardDescription>Proof through practice</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Creating real-world projects that demonstrate skills in DevOps, automation, and full-stack development —
                  proving I can <em>do the work</em>, not just talk about it.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Certifications & Learning Path */}
      <section>
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Certifications & Learning Path" subtitle="Bias for action and hands-on learning" />
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-xl font-semibold">Completed</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>Google Professional Cloud Architect (PCA)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Next Steps</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>LPIC-1</li>
                    <li>Certified Kubernetes Administrator (CKA)</li>
                    <li>Additional DevOps/Cloud certifications</li>
                  </ul>
                </div>
              </div>
              <blockquote className="mt-6 border-l-4 border-orange-500/60 pl-4 italic text-muted-foreground">
                “To learn and not do is not to learn; to learn and then do is to learn.” — Stephen Covey
              </blockquote>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What's Next */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="What’s Next" subtitle="Where I’m excited to add value" />
          <Card>
            <CardContent className="flex flex-col items-start gap-6 pt-6 md:flex-row md:items-center md:justify-between">
              <p className="max-w-3xl text-foreground/90">
                I’m eager to join a forward-thinking team as a <strong>TAM, Cloud Engineer, or Solutions Architect</strong>.
                My blend of entrepreneurial drive, technical expertise, and customer-facing experience fits roles that
                require both technical depth and business alignment.
              </p>
              <div className="flex gap-3">
                <Link href="mailto:example@gmail.com">
                  <Button>Get in Touch</Button>
                </Link>
                <Link href="https://www.linkedin.com/in/dalton-ousley/" target="_blank" rel="noreferrer">
                  <Button variant="outline">View LinkedIn</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}


