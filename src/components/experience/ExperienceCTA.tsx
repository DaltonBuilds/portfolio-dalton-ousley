"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useContactModal } from "@/contexts/ContactModalContext";

export const ExperienceCTA: React.FC = () => {
  const { openContactModal } = useContactModal();

  return (
    <section className="section-padding">
      <div className="container mx-auto max-w-screen-2xl text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Let's build something reliable together</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          If you're working on infrastructure that matters and want to connect, I'd love to hear about it.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button size="lg" onClick={openContactModal}>
            Get in touch
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/projects">View my projects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
