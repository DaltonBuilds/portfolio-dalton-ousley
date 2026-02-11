"use client";

import React from 'react';
import { Card } from "@/components/ui/Card";
import {
  Server,
  GitBranch,
  Eye,
  Cloud,
} from "lucide-react";

const buildItems = [
  {
    Icon: Server,
    name: "Production Homelab",
    description: "3-node k3s cluster on Proxmox with NFS storage, MetalLB load balancing, and Cloudflare tunnels for secure ingress.",
    iconColor: "text-blue-500 dark:text-blue-400",
  },
  {
    Icon: GitBranch,
    name: "GitOps Workflows",
    description: "ArgoCD managing deployments from Git repos. Infrastructure as code with Terraform. Everything version-controlled and auditable.",
    iconColor: "text-purple-500 dark:text-purple-400",
  },
  {
    Icon: Eye,
    name: "Observability Stack",
    description: "Prometheus + Grafana for metrics and dashboards. Learning to monitor what matters and respond to what breaks.",
    iconColor: "text-emerald-500 dark:text-emerald-400",
  },
  {
    Icon: Cloud,
    name: "Cloud Infrastructure",
    description: "AWS backend for this site (Lambda, DynamoDB, EventBridge). Working on AKS deployments. GCP Professional Cloud Architect certified.",
    iconColor: "text-orange-500 dark:text-orange-400",
  },
];

const WhatIBuildSection: React.FC = () => {
  return (
    <section id="what-i-build" className="section-padding">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="section-header mb-12 text-center">
          What I <span className="gradient-text">Build</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {buildItems.map((item) => (
            <Card 
              key={item.name} 
              className="bg-card/50 border border-border/20 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 p-6"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg bg-background/50 ${item.iconColor}`}>
                  <item.Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                  <p className="text-foreground/60 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatIBuildSection;
