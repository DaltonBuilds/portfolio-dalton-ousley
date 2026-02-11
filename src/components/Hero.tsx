"use client"

import { Button } from "@/components/ui/Button";
import React from 'react';
import { ArrowDownToLine, Rocket } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

import { siteConfig } from '@/config/site.config'
import { PATHS } from '@/config/constants'
import { useContactModal } from '@/contexts/ContactModalContext'

const Hero: React.FC = () => {
  const { openContactModal } = useContactModal()
  return (
    <>
      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>
      
      <section 
        id="hero" 
        className="relative flex flex-col items-center justify-center text-center py-20 md:py-32 min-h-screen overflow-hidden"
        aria-labelledby="hero-heading"
        role="banner"
      >
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-30 animate-pulse animation-delay-200"></div>
      </div>

      <div className="relative z-10 px-4 max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-50 md:h-50 rounded-full mx-auto overflow-hidden border-4 border-primary shadow-xl shadow-primary/20">
            <Image
              src={PATHS.PROFILE_IMAGE}
              alt={siteConfig.name}
              width={150}
              height={150}
              className="object-cover h-full w-full"
              sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 200px"
              priority
            />
          </div>
        </div>
        <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6">
          Hi, I&apos;m <span className="gradient-text">{siteConfig.name.split(' ')[0]}</span>
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold text-foreground/80 mb-8">
          {siteConfig.professional.role}
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-foreground/60 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
          Building reliable infrastructure with Kubernetes, GitOps, and cloud-native tools. Running a production homelab to learn, break things, and build better systems.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8 py-6" aria-label="Download Dalton Ousley's CV" asChild>
            <a href="/dalton-ousley-resume.pdf" download>
              <ArrowDownToLine className="mr-2 h-5 w-5" aria-hidden="true" /> Download CV
            </a>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-8 py-6" 
            aria-label="Contact Dalton about opportunities"
            onClick={openContactModal}
          >
            <Rocket className="mr-2 h-5 w-5" aria-hidden="true" /> Get in Touch
          </Button>
        </div>
      </div>
      
      <a 
        href="#services" 
        className="hidden sm:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg p-2 transition-all hover:gap-3"
        aria-label="Scroll down to services section"
      >
        <span className="text-sm font-medium text-foreground/70 tracking-wide">Scroll to explore</span>
        <ChevronDown className="w-6 h-6 text-foreground/70 animate-bounce" aria-hidden="true" />
      </a>
      </section>
    </>
  );
};

export default Hero;