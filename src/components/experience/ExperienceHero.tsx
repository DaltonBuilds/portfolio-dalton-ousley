"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { Button } from "@/components/ui/Button";

type Stat = {
  label: string;
  value: string;
  ariaLabel?: string;
};

interface ExperienceHeroProps {
  heading: string;
  subheading: string;
  stats: Stat[];
}

export const ExperienceHero: React.FC<ExperienceHeroProps> = ({ heading, subheading, stats }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <section className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
      <div ref={containerRef} className="relative container mx-auto max-w-screen-2xl py-16 md:py-24">
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="section-header gradient-text-orange-blue mb-4">
            {heading}
          </h1>
          <p className="mt-2 text-lg md:text-xl text-muted-foreground">
            {subheading}
          </p>
          <div ref={sourceRef} className="mx-auto mt-8 h-3 w-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_0_6px_rgba(99,102,241,0.15)]" aria-hidden="true" />
        </div>

        <div className="relative z-10 mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              ref={(el) => { statRefs.current[i] = el; }}
              className="glass rounded-xl p-5 text-center hover:shadow-xl transition"
              aria-label={s.ariaLabel ?? `${s.label} ${s.value}`}
            >
              <div className="text-3xl md:text-4xl font-extrabold text-primary">
                {s.value}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Beams */}
        {stats.map((_, i) => (
          <AnimatedBeam
            key={`beam-${i}`}
            containerRef={containerRef}
            fromRef={sourceRef}
            toRef={{ current: statRefs.current[i] }}
            pathColor="#64748b"
            pathWidth={2}
            pathOpacity={0.25}
            gradientStartColor="#22d3ee"
            gradientStopColor="#6366f1"
          />
        ))}

        <div className="relative z-10 mt-10 flex items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="mailto:example@gmail.com">Get in Touch</Link>
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


