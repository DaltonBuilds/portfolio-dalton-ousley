"use client";

import React from "react";
import { Server, Database, Globe, GitBranch, Activity, Shield, HardDrive } from "lucide-react";

export const HomelabArchitecture: React.FC = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Architecture Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        
        {/* Horizontal connector line spanning all three columns - hidden on mobile */}
        <div className="hidden lg:block absolute top-[1.75rem] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent" aria-hidden="true"></div>
        
        {/* Left Column: Infrastructure */}
        <div className="space-y-4 relative">
          <div className="text-center mb-4 relative">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide relative inline-block">
              Infrastructure
            </h3>
            {/* Vertical line down - hidden on mobile */}
            <div className="hidden lg:block absolute left-1/2 top-full w-0.5 h-4 bg-orange-500 -translate-x-1/2" aria-hidden="true"></div>
          </div>
          
          {/* Proxmox Host */}
          <div className="glass rounded-lg p-4 border-2 border-purple-500/30 relative">
            {/* Connector line from title */}
            <div className="hidden lg:block absolute left-1/2 -top-4 w-0.5 h-4 bg-orange-500 -translate-x-1/2" aria-hidden="true"></div>
            <div className="flex items-center gap-2 mb-2">
              <Server className="h-5 w-5 text-purple-400" />
              <h4 className="font-semibold text-sm">Proxmox Host</h4>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Ryzen 9 7900x</p>
              <p>64GB RAM</p>
              <p>4TB NVMe SSD</p>
              <p>RTX 5070</p>
            </div>
          </div>

          {/* Storage */}
          <div className="glass rounded-lg p-4 border-2 border-blue-500/30 relative">
            {/* Connector line from previous card */}
            <div className="hidden lg:block absolute left-1/2 -top-4 w-0.5 h-4 bg-orange-500 -translate-x-1/2" aria-hidden="true"></div>
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="h-5 w-5 text-blue-400" />
              <h4 className="font-semibold text-sm">NFS Storage</h4>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>2x 2TB NVMe</p>
              <p>ZFS RAID1 Mirror</p>
              <p>Persistent Volumes</p>
            </div>
          </div>
        </div>

        {/* Middle Column: K3s Cluster */}
        <div className="space-y-4 relative">
          <div className="text-center mb-4 relative">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide relative inline-block">
              K3s Cluster
            </h3>
            {/* Vertical line down - hidden on mobile */}
            <div className="hidden lg:block absolute left-1/2 top-full w-0.5 h-4 bg-orange-500 -translate-x-1/2" aria-hidden="true"></div>
          </div>

          {/* Cluster Nodes */}
          <div className="glass rounded-lg p-4 border-2 border-cyan-500/30 relative">
            {/* Connector line from title */}
            <div className="hidden lg:block absolute left-1/2 -top-4 w-0.5 h-4 bg-orange-500 -translate-x-1/2" aria-hidden="true"></div>
            <div className="flex items-center gap-2 mb-3">
              <Server className="h-5 w-5 text-cyan-400" />
              <h4 className="font-semibold text-sm">3-Node Cluster</h4>
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((node) => (
                <div key={node} className="flex items-center gap-2 text-xs">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-muted-foreground">ThinkCentre M920q #{node}</span>
                </div>
              ))}
            </div>
          </div>

          {/* GitOps */}
          <div className="glass rounded-lg p-4 border-2 border-orange-500/30 relative">
            {/* Connector line from previous card */}
            <div className="hidden lg:block absolute left-1/2 -top-4 w-0.5 h-4 bg-orange-500 -translate-x-1/2" aria-hidden="true"></div>
            <div className="flex items-center gap-2 mb-2">
              <GitBranch className="h-5 w-5 text-orange-400" />
              <h4 className="font-semibold text-sm">GitOps</h4>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>ArgoCD</p>
              <p>App-of-Apps Pattern</p>
              <p>Declarative Config</p>
            </div>
          </div>

          {/* Ingress */}
          <div className="glass rounded-lg p-4 border-2 border-green-500/30 relative">
            {/* Connector line from previous card */}
            <div className="hidden lg:block absolute left-1/2 -top-4 w-0.5 h-4 bg-orange-500 -translate-x-1/2" aria-hidden="true"></div>
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-5 w-5 text-green-400" />
              <h4 className="font-semibold text-sm">Ingress</h4>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Traefik</p>
              <p>Cloudflare Tunnel</p>
              <p>*.daltonbuilds.com</p>
            </div>
          </div>
        </div>

        {/* Right Column: Services */}
        <div className="space-y-4 relative">
          <div className="text-center mb-4 relative">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Services</h3>
            {/* Vertical line down - hidden on mobile */}
            <div className="hidden lg:block absolute left-1/2 top-full w-0.5 h-4 bg-orange-500 -translate-x-1/2" aria-hidden="true"></div>
          </div>

          {/* Observability */}
          <div className="glass rounded-lg p-4 border-2 border-yellow-500/30 relative">
            {/* Connector line from title */}
            <div className="hidden lg:block absolute left-1/2 -top-4 w-0.5 h-4 bg-orange-500 -translate-x-1/2" aria-hidden="true"></div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-yellow-400" />
              <h4 className="font-semibold text-sm">Observability</h4>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Prometheus</p>
              <p>Grafana</p>
              <p>Alertmanager</p>
              <p>Uptime Kuma</p>
            </div>
          </div>

          {/* Applications */}
          <div className="glass rounded-lg p-4 border-2 border-pink-500/30 relative">
            {/* Connector line from previous card */}
            <div className="hidden lg:block absolute left-1/2 -top-4 w-0.5 h-4 bg-orange-500 -translate-x-1/2" aria-hidden="true"></div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-pink-400" />
              <h4 className="font-semibold text-sm">Applications</h4>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>n8n Workflows</p>
              <p>PostgreSQL</p>
              <p>ArgoCD UI</p>
            </div>
          </div>

          {/* Database */}
          <div className="glass rounded-lg p-4 border-2 border-indigo-500/30 relative">
            {/* Connector line from previous card */}
            <div className="hidden lg:block absolute left-1/2 -top-4 w-0.5 h-4 bg-orange-500 -translate-x-1/2" aria-hidden="true"></div>
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-5 w-5 text-indigo-400" />
              <h4 className="font-semibold text-sm">Data Layer</h4>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>PostgreSQL</p>
              <p>Persistent Storage</p>
              <p>NFS Backed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Pills */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {[
          { label: "Kubernetes", color: "bg-blue-500/10 border-blue-500/30 text-blue-300" },
          { label: "GitOps", color: "bg-orange-500/10 border-orange-500/30 text-orange-300" },
          { label: "Prometheus", color: "bg-red-500/10 border-red-500/30 text-red-300" },
          { label: "Traefik", color: "bg-green-500/10 border-green-500/30 text-green-300" },
          { label: "Cloudflare", color: "bg-yellow-500/10 border-yellow-500/30 text-yellow-300" },
          { label: "Ansible", color: "bg-red-500/10 border-red-500/30 text-red-300" },
          { label: "ZFS", color: "bg-purple-500/10 border-purple-500/30 text-purple-300" },
          { label: "NFS", color: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300" },
          { label: "Proxmox", color: "bg-pink-500/10 border-pink-500/30 text-pink-300" },
        ].map((tech) => (
          <span
            key={tech.label}
            className={`inline-flex items-center rounded-md border px-3 py-1 text-xs font-medium ${tech.color}`}
          >
            {tech.label}
          </span>
        ))}
      </div>
    </div>
  );
};
