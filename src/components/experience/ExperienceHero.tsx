"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useContactModal } from "@/contexts/ContactModalContext";
import { HomelabArchitecture } from "./HomelabArchitecture";

interface ExperienceHeroProps {
  heading: string;
  subheading: string;
}

export const ExperienceHero: React.FC<ExperienceHeroProps> = ({ heading, subheading }) => {
  const { openContactModal } = useContactModal();

  return (
    <section className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
      <div className="relative container mx-auto max-w-screen-2xl py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 text-center max-w-4xl mx-auto mb-12">
          <h1 className="section-header gradient-text-orange-blue mb-4">
            {heading}
          </h1>
          <p className="mt-2 text-base sm:text-lg md:text-xl text-muted-foreground px-4">
            {subheading}
          </p>
        </div>

        {/* Homelab Architecture Showcase */}
        <div className="relative z-10 mb-12">
          <div className="glass rounded-2xl p-8 md:p-12 border border-primary/20 shadow-2xl shadow-primary/5">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Production Homelab Infrastructure</h2>
              <p className="text-muted-foreground">3-node K3s cluster with GitOps, observability, and enterprise-grade storage</p>
            </div>
            <HomelabArchitecture />
          </div>
        </div>

        <div className="relative z-10 mt-10 flex items-center justify-center gap-4">
          <Button size="lg" onClick={openContactModal}>
            Get in Touch
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/projects">See Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ExperienceHero;
