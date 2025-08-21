import { Button } from "@/components/ui/Button";
import React from 'react';
import { ArrowDownToLine, Rocket } from 'lucide-react';

interface HeroProps {
  name: string;
  role: string;
  tagline: string;
}

const Hero: React.FC<HeroProps> = ({ name, role, tagline }) => {
  return (
    <section 
      id="hero" 
      className="relative flex flex-col items-center justify-center text-center py-20 md:py-32 min-h-screen bg-gradient-to-br from-blue-500/5 to-orange-500/5 overflow-hidden animate-fade-in-up"
    >
      {/* Background pattern - subtle circles and squares */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-blue-500 blur-2xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-lg bg-orange-500 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-orange-500 blur-xl animate-pulse"></div>
      </div>

      <div className="relative z-10 px-4 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold text-primary mb-4 leading-tight animate-fade-in-up">
          Hi, I&apos;m <span className="text-secondary"> {name}</span>
        </h1>
        <h2 className="text-2xl md:text-3xl text-foreground mb-6 font-semibold animate-fade-in-up animation-delay-200">
          {role}
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-prose mx-auto animate-fade-in-up animation-delay-400">
          {tagline}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50" size="lg">
            <ArrowDownToLine className="mr-2 h-5 w-5" /> Download Resume
          </Button>
          <Button variant="outline" className="text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50" size="lg">
            <Rocket className="mr-2 h-5 w-5" /> View Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;