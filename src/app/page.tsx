import Hero from "@/components/Hero";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import BlogSection from "@/components/BlogSection";
import SectionHeader from "@/components/SectionHeader";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Mail } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Hero 
        name="Dalton Ousley"
        role="Cloud-focused Engineer"
        tagline="Passionate about DevOps, Kubernetes, and cloud-native solutions, building scalable and resilient systems."
      />

      <SkillsSection />

      <ExperienceSection />

      <ProjectsSection />

      <BlogSection />

      {/* Contact CTA */}
      <section id="contact-cta" className="container mx-auto py-16 px-4 text-center animate-fade-in-up">
        <SectionHeader title="Get in Touch" icon={Mail} />
        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl mt-4 mb-8">
          Ready to start a project or just want to chat? Feel free to reach out!
        </p>
        <Button size="lg" asChild className="shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50">
          <Link href="/contact">
            <Mail className="mr-2 h-5 w-5" /> Contact Me
          </Link>
        </Button>
      </section>
    </div>
  );
};

export default Home;