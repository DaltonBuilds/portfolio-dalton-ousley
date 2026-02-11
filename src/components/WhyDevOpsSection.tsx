import React from 'react';
import { Card } from "@/components/ui/Card";

const WhyDevOpsSection: React.FC = () => {
  return (
    <section id="why-devops" className="section-padding">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="section-header mb-12 text-center">
          Why <span className="gradient-text">DevOps?</span>
        </h2>
        <Card className="bg-card/50 border border-border/20 backdrop-blur-sm p-8 md:p-12">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-foreground/80 leading-relaxed mb-6">
              I've always been drawn to the infrastructure layer—the systems that make everything else possible. 
              While building web applications, I found myself more excited about deployment pipelines, monitoring dashboards, 
              and infrastructure automation than the frontend code.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-6">
              That curiosity led me to build a production homelab: a 3-node Kubernetes cluster running real workloads, 
              managed with GitOps, monitored with Prometheus and Grafana. I wanted to understand how reliable systems 
              are built, not just in theory, but by running them, breaking them, and fixing them.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              DevOps isn't just about tools—it's about building systems that teams can trust. I'm seeking full-time 
              DevOps and Cloud Engineering roles where I can bring this hands-on operational experience to production 
              environments, collaborate with talented teams, and continue learning from real-world challenges at scale.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default WhyDevOpsSection;
