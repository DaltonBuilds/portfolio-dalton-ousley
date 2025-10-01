"use client";

import React from 'react';
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import {
  Globe,
  Sparkles,
  Rocket,
  Layers,
  UserRound,
} from "lucide-react";

const features = [
  {
    Icon: UserRound,
    name: "Client-First Approach",
    description: "Building trust through transparent communication and collaboration.",
    background: <div aria-hidden="true" className="absolute -right-20 -top-20 opacity-60" />,
    className: "md:col-span-1",
    iconColor: "text-blue-500 dark:text-blue-400",
  },
  {
    Icon: Sparkles,
    name: "AI-Powered Solutions",
    description: "Specializing in intelligent automation and LLM integrations.",
    background: <div aria-hidden="true" className="absolute -right-20 -top-20 opacity-60" />,
    className: "md:col-span-1",
    iconColor: "text-purple-500 dark:text-purple-400",
  },
  {
    Icon: Globe,
    name: "Global Flexibility",
    description: "Available across time zones for seamless worldwide collaboration.",
    background: <div aria-hidden="true" className="absolute -right-20 -top-20 opacity-60" />,
    className: "md:col-span-1 lg:row-span-2",
    iconColor: "text-emerald-500 dark:text-emerald-400",
  },
  {
    Icon: Rocket,
    name: "Ready to Collaborate",
    description: "Let&apos;s create something amazing together.",
    background: <div aria-hidden="true" className="absolute -right-20 -top-20 opacity-60" />,
    className: "md:col-span-2 lg:col-span-2",
    iconColor: "text-orange-500 dark:text-orange-400",
  },
  {
    Icon: Layers,
    name: "Technical Stack",
    description: "Click to see detailed technology breakdown",
    background: <div aria-hidden="true" className="absolute -right-20 -top-20 opacity-60" />,
    className: "md:col-span-2 lg:col-span-1",
    iconColor: "text-cyan-500 dark:text-cyan-400",
  },
];

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="section-padding">
      <div className="container mx-auto px-4 max-w-7xl">
        <BentoGrid>
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
};

export default ServicesSection;
