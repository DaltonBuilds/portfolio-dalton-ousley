'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Code2, Lightbulb, MessageSquare, Target, Award, Rocket, Users, Zap } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import CredlyBadge from '@/components/CredlyBadge';
import { useContactModal } from '@/contexts/ContactModalContext';

function TerminalWidget() {
  return (
    <div className="w-full max-w-3xl md:max-w-4xl overflow-hidden rounded-lg border border-blue-500/50 bg-[#0b1220] text-gray-200 shadow-xl shadow-blue-500/20">
      <div className="flex items-center justify-between border-b border-blue-500/30 bg-[#0d1526] px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs text-blue-200/70 truncate">dalton@homelab:~</span>
      </div>
      <div className="px-2 sm:px-4 py-3 font-mono text-xs sm:text-[13px] md:text-sm">
        <div className="text-blue-300">$ kubectl get pods -n observability</div>
        <div className="mt-1 text-blue-100/90 text-[11px] sm:text-xs overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left pr-4 font-normal">NAME</th>
                <th className="text-left pr-4 font-normal">READY</th>
                <th className="text-left pr-4 font-normal">STATUS</th>
                <th className="text-left pr-4 font-normal">RESTARTS</th>
                <th className="text-left font-normal">AGE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="pr-4">grafana-6c9dbbd666-ck9v2</td>
                <td className="pr-4">1/1</td>
                <td className="pr-4">Running</td>
                <td className="pr-4">0</td>
                <td>3d</td>
              </tr>
              <tr>
                <td className="pr-4">prometheus-768b9b9f7c-z2s4q</td>
                <td className="pr-4">2/2</td>
                <td className="pr-4">Running</td>
                <td className="pr-4">0</td>
                <td>3d</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-3 text-blue-300">$ helm ls -n automation</div>
        <div className="mt-1 text-blue-100/90 text-[11px] sm:text-xs overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left pr-4 font-normal">NAME</th>
                <th className="text-left pr-4 font-normal">NAMESPACE</th>
                <th className="text-left pr-4 font-normal">REVISION</th>
                <th className="text-left pr-4 font-normal">UPDATED</th>
                <th className="text-left pr-4 font-normal">STATUS</th>
                <th className="text-left font-normal">CHART</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="pr-4">n8n</td>
                <td className="pr-4">automation</td>
                <td className="pr-4">4</td>
                <td className="pr-4 whitespace-nowrap">2026-01-07 12:00</td>
                <td className="pr-4">deployed</td>
                <td>n8n-0.21.0</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-3 text-blue-300">$ terraform plan</div>
        <div className="mt-1 text-green-300/90 text-xs">Plan: 3 to add, 0 to change, 0 to destroy</div>
        
        <div className="mt-3 flex items-center gap-2 text-orange-300">
          <span className="text-blue-200/70">dalton@homelab</span>
          <span className="text-blue-200/50">$</span>
          <span className="inline-block h-4 w-1 bg-blue-100 animate-blink" />
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const { openContactModal } = useContactModal();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden" aria-labelledby="about-heading">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        
        <div className="container mx-auto max-w-screen-2xl px-6 sm:px-8 lg:px-12 xl:px-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative grid grid-cols-1 items-start gap-8 md:grid-cols-[1.2fr_1fr] lg:gap-12 py-12 md:py-16"
          >
            {/* Text Content */}
            <div className="relative z-10 pt-8 md:pt-16 lg:pt-20">
              <motion.h1 
                id="about-heading"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight"
              >
                Hi, I'm <span className="gradient-text">Dalton</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6 text-xl md:text-2xl text-muted-foreground leading-relaxed"
              >
                I build and operate infrastructure because I love the challenge of making complex systems reliable, observable, and elegant.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Button onClick={openContactModal} size="lg">
                  <Rocket className="mr-2 h-5 w-5" />
                  Get in Touch
                </Button>
                <Link href="https://www.linkedin.com/in/dalton-ousley/" target="_blank" rel="noreferrer">
                  <Button variant="outline" size="lg">
                    <Users className="mr-2 h-5 w-5" />
                    LinkedIn
                  </Button>
                </Link>
                <Link href="/dalton-ousley-resume.pdf" target="_blank" rel="noreferrer">
                  <Button variant="secondary" size="lg">
                    <Award className="mr-2 h-5 w-5" />
                    Resume
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Portrait Image with Fade Effect */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex justify-center md:justify-end"
            >
              <div className="relative w-full max-w-md md:max-w-lg">
                <Image
                  src="/Dalton-Ousley-portrait-black-shirt.avif"
                  alt="Dalton Ousley portrait"
                  width={600}
                  height={800}
                  className="w-full h-auto object-cover"
                  priority
                  style={{ 
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)'
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* My Story */}
      <section className="section-padding" aria-labelledby="my-story-heading">
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <h2 id="my-story-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2 relative pb-2 text-center break-words max-w-full overflow-hidden">
            My Story
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-secondary rounded-full"></span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-center">{`> From marketing automation to infrastructure engineering`}</p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-4 text-foreground/90 text-center mt-8"
          >
            <p>
              I didn't start in infrastructure. My path began in digital marketing and business automation, where I helped clients build CRM systems, integrate APIs, and automate workflows. I was good at it—but something was missing.
            </p>
            <p>
              The turning point came when I started asking deeper questions: How do these systems actually run? What happens when they scale? How do you make them reliable? I found myself more interested in the infrastructure layer than the business logic on top of it.
            </p>
            <p>
              So I built a homelab. Not a toy setup—a production-grade 3-node Kubernetes cluster running on Proxmox with GitOps, observability, and real workloads. I deployed n8n for automation, configured Prometheus and Grafana for monitoring, set up Cloudflare tunnels for secure ingress, and learned to troubleshoot everything from networking issues to persistent volume claims.
            </p>
            <p>
              That's when I realized: this is what I want to do. Not as a side project, but as my career. I want to be the person who designs resilient systems, automates deployments, and keeps services running smoothly. I want to work on infrastructure that matters.
            </p>
          </motion.div>
        </div>
      </section>

      {/* I Learn by Doing - Terminal Showcase */}
      <section className="section-padding bg-gradient-to-b from-background via-muted/20 to-background" aria-labelledby="learn-by-doing-heading">
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <h2 id="learn-by-doing-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2 relative pb-2 text-center break-words max-w-full overflow-hidden">
            I Learn by Doing
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-secondary rounded-full"></span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-center">{`> I don't just read documentation—I deploy it, break it, fix it, and understand why it works`}</p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-8 mt-8"
          >
            <div className="text-center text-foreground/90 space-y-4">
              <p>
                My homelab isn't a resume bullet—it's where I spend nights debugging ingress controllers and optimizing resource limits because I genuinely want to understand how things work at a deep level. Below is a snapshot of real commands from my actual infrastructure.
              </p>
            </div>
            <div className="flex justify-center">
              <TerminalWidget />
            </div>
            <div className="text-center text-foreground/90 space-y-4">
              <p>
                This hands-on approach extends beyond my homelab. This portfolio site is a real production application with a serverless backend on AWS, CI/CD pipelines, and infrastructure as code. Every project I build teaches me something new that I can apply to production systems.
              </p>
              <p>
                I'm driven by the idea that infrastructure should be invisible when it works and debuggable when it doesn't. The best compliment an infrastructure engineer can get is "I didn't even notice the deployment happened."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How I Work */}
      <section className="section-padding" aria-labelledby="how-i-work-heading">
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <h2 id="how-i-work-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2 relative pb-2 text-center break-words max-w-full overflow-hidden">
            How I Work
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-secondary rounded-full"></span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-center">{`> My approach to infrastructure and problem-solving`}</p>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-8"
          >
            <motion.div variants={itemVariants}>
              <Card className="glass border-2 border-green-500/20 h-full group hover:border-green-500/40 transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Zap className="h-6 w-6 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary">I Value Reliability Over Complexity</h3>
                  </div>
                  <p className="text-foreground/90">
                    The best infrastructure is boring infrastructure. I'd rather build something simple that runs for months without intervention than something clever that requires constant attention. Observability, automation, and clear documentation aren't optional—they're how you sleep at night.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="glass border-2 border-blue-500/20 h-full group hover:border-blue-500/40 transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <MessageSquare className="h-6 w-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary">I Communicate Clearly</h3>
                  </div>
                  <p className="text-foreground/90">
                    Years of working with non-technical clients taught me to explain complex systems in plain language. I can write runbooks that junior engineers can follow, document architecture decisions that make sense six months later, and explain why we need to invest in monitoring before the outage happens.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="glass border-2 border-orange-500/20 h-full group hover:border-orange-500/40 transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Target className="h-6 w-6 text-orange-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary">I Own the Outcome</h3>
                  </div>
                  <p className="text-foreground/90">
                    Whether it's a deployment pipeline or a monitoring dashboard, I don't just build it and walk away. I think about edge cases, failure modes, and how the next person will maintain it. If something breaks at 2am, I want to be the kind of engineer who left enough breadcrumbs to fix it quickly.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="glass border-2 border-purple-500/20 h-full group hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Code2 className="h-6 w-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary">I Stay Curious</h3>
                  </div>
                  <p className="text-foreground/90">
                    When I'm not working on infrastructure, I'm usually still learning something technical—whether that's exploring new cloud services, reading SRE books, or experimenting with automation workflows. I'm the kind of person who finds Kubernetes networking diagrams genuinely interesting.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section-padding" aria-labelledby="certifications-heading">
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <h2 id="certifications-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2 relative pb-2 text-center break-words max-w-full overflow-hidden">
            Certifications
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-secondary rounded-full"></span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-center">{`> Validating knowledge with hands-on practice`}</p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-8"
          >
            <Card className="glass border-2 border-yellow-500/20">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="h-5 w-5 text-yellow-400" />
                      <h3 className="text-xl font-semibold text-primary">Completed</h3>
                    </div>
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <CredlyBadge width={160} height={160} />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Google Professional Cloud Architect</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Earned September 2025
                        </p>
                        <p className="text-foreground/90 mt-3">
                          Validated my understanding of cloud architecture, infrastructure design, and GCP services through hands-on scenarios and case studies.
                        </p>
                      </div>
                    </div>
                    <blockquote className="mt-6 border-l-4 border-orange-500/60 pl-4 italic text-muted-foreground">
                      "To learn and not do is not to learn; to learn and then do is to learn."
                    </blockquote>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="h-5 w-5 text-orange-400" />
                      <h3 className="text-xl font-semibold text-primary">In Progress</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
                        <span className="flex-shrink-0 mt-1 h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                        <div>
                          <p className="font-semibold">Certified Kubernetes Administrator (CKA)</p>
                          <p className="text-sm text-muted-foreground">Target: Q2 2026</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
                        <span className="flex-shrink-0 mt-1 h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                        <div>
                          <p className="font-semibold">Certified Kubernetes Application Developer (CKAD)</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
                        <span className="flex-shrink-0 mt-1 h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                        <div>
                          <p className="font-semibold">Certified Kubernetes Security Specialist (CKS)</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
                        <span className="flex-shrink-0 mt-1 h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                        <div>
                          <p className="font-semibold">Kubernetes and Cloud Native Associate (KCNA)</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
                        <span className="flex-shrink-0 mt-1 h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                        <div>
                          <p className="font-semibold">Kubernetes and Cloud Native Security Associate (KCSA)</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
                        <span className="flex-shrink-0 mt-1 h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                        <div>
                          <p className="font-semibold">LPIC-1: Linux Administrator</p>
                          <p className="text-sm text-muted-foreground">Target: Q4 2026</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* What I'm Looking For - CTA */}
      <section className="section-padding bg-gradient-to-b from-background via-primary/5 to-background" aria-labelledby="looking-for-heading">
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <h2 id="looking-for-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2 relative pb-2 text-center break-words max-w-full overflow-hidden">
            What I'm Looking For
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-secondary rounded-full"></span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-center">{`> The right team and the right challenge`}</p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-8"
          >
            <div className="max-w-4xl mx-auto">
              <div className="relative rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 md:p-10 shadow-2xl shadow-primary/20">
                {/* Accent corner decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/20 to-transparent rounded-tr-full" />
                
                <div className="relative z-10 space-y-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                    <Rocket className="h-8 w-8 text-primary" />
                  </div>
                  
                  <div className="space-y-4 text-foreground/90">
                    <p className="text-lg">
                      I'm actively seeking a full-time role as a <strong className="text-primary">DevOps Engineer</strong> or <strong className="text-primary">Cloud Engineer</strong> where I can contribute to building reliable, scalable infrastructure. I want to work with a team that values automation, observability, and continuous improvement.
                    </p>
                    <p>
                      I'm looking for an environment where I can learn from experienced engineers while bringing my own perspective from operating real infrastructure. I want to be part of on-call rotations, incident response, and the day-to-day work of keeping systems running.
                    </p>
                    <p className="text-lg font-medium text-primary">
                      If you're building infrastructure that matters and need someone who's genuinely passionate about this work, let's talk.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-4 pt-6">
                    <Button onClick={openContactModal} size="lg" className="shadow-lg shadow-primary/30">
                      <Rocket className="mr-2 h-4 w-4" />
                      Get in Touch
                    </Button>
                    <Link href="/experience">
                      <Button variant="outline" size="lg">
                        <Code2 className="mr-2 h-4 w-4" />
                        View Experience
                      </Button>
                    </Link>
                    <Link href="https://www.linkedin.com/in/dalton-ousley/" target="_blank" rel="noreferrer">
                      <Button variant="secondary" size="lg">
                        <Users className="mr-2 h-4 w-4" />
                        Connect on LinkedIn
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
