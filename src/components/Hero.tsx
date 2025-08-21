import { Button } from "@/components/ui/Button";
import React from 'react';
import { ArrowDownToLine, Rocket } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

const Hero: React.FC = () => {
  return (
    <section 
      id="hero" 
      className="relative flex flex-col items-center justify-center text-center py-20 md:py-32 min-h-screen overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-30 animate-pulse animation-delay-200"></div>
      </div>

      <div className="relative z-10 px-4 max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="w-50 h-50 rounded-full mx-auto overflow-hidden border-4 border-primary shadow-xl shadow-primary/20">
            <Image
              src="/dalton-ousley-profile-pic.webp"
              alt="Dalton Ousley"
              width={150}
              height={150}
              className="object-cover h-full w-full"
            />
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Hi, I'm <span className="gradient-text">Dalton</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-semibold text-foreground/80 mb-8">
          Cloud Architect & DevOps Engineer
        </h2>
        <p className="text-lg md:text-xl text-foreground/60 mb-12 max-w-3xl mx-auto">
          Building innovative cloud solutions and scalable architectures that drive business transformation.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8 py-6">
            <ArrowDownToLine className="mr-2 h-5 w-5" /> Download CV
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-6">
            <Rocket className="mr-2 h-5 w-5" /> Let's Build Together
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2">
        <span className="text-sm text-foreground/60">Scroll to explore</span>
        <ChevronDown className="w-6 h-6 text-foreground/60 animate-bounce" />
      </div>
    </section>
  );
};

export default Hero;