"use client";

import React from 'react';
import { Button } from "@/components/ui/Button";
import { Mail, FileText } from 'lucide-react';
import { useContactModal } from '@/contexts/ContactModalContext';

const CTASection: React.FC = () => {
  const { openContactModal } = useContactModal();
  
  return (
    <section id="cta" className="section-padding">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="glass rounded-2xl p-8 md:p-12 border border-primary/20 shadow-2xl shadow-primary/5 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Let's Build Reliable Systems Together
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            I'm actively seeking full-time DevOps and Cloud Engineering roles where I can bring hands-on 
            infrastructure experience, a passion for automation, and a commitment to operational excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={openContactModal}
            >
              <Mail className="mr-2 h-5 w-5" aria-hidden="true" /> Get in Touch
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6"
              asChild
            >
              <a href="/dalton-ousley-resume.pdf" download>
                <FileText className="mr-2 h-5 w-5" aria-hidden="true" /> Download Resume
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
