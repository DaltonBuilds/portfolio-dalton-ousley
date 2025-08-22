"use client";

import React from 'react';
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import {
  Briefcase,
  Code,
  Eye,
  Send,
  Users,
} from "lucide-react";

const features = [
  {
    Icon: Users,
    name: "Client-First Approach",
    description: "Building trust through transparent communication and collaboration.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:row-start-1 lg:row-end-2 lg:col-start-1 lg:col-end-2",
  },
  {
    Icon: Briefcase,
    name: "Global Flexibility",
    description: "Available across time zones for seamless worldwide collaboration.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:row-start-1 lg:row-end-2 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: Eye,
    name: "Technical Stack",
    description: "Click to see detailed technology breakdown",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:row-start-1 lg:row-end-2 lg:col-start-3 lg:col-end-4",
  },
  {
    Icon: Code,
    name: "AI-Powered Solutions",
    description: "Specializing in intelligent automation and LLM integrations.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:row-start-2 lg:row-end-3 lg:col-start-1 lg:col-end-2",
  },
  {
    Icon: Send,
    name: "Ready to Collaborate",
    description: "Let's create something amazing together.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:row-start-2 lg:row-end-3 lg:col-start-2 lg:col-end-4",
  },
];

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="section-padding">
      <div className="container mx-auto px-4">
        <BentoGrid className="lg:grid-rows-2">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
};

export default ServicesSection;
