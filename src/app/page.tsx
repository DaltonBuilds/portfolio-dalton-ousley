import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import WhyDevOpsSection from "@/components/WhyDevOpsSection";
import WhatIBuildSection from "@/components/WhatIBuildSection";
import { InteractiveSkillsSection } from "@/components/InteractiveSkillsSection";
import GitHubActivityWidget from "@/components/GitHubActivityWidget";
import { LatestPostsWidget } from "@/components/blog/LatestPostsWidget";
import CTASection from "@/components/CTASection";

// Dynamically import CertificationsSection to reduce initial bundle size
// This component uses framer-motion and is below the fold
const CertificationsSection = dynamic(
  () => import("@/components/CertificationsSection").then(mod => ({ default: mod.CertificationsSection })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-12">
        <div className="animate-pulse text-muted-foreground">Loading certifications...</div>
      </div>
    ),
  }
);

const Home = () => {
  return (
    <>
      <Hero />
      <WhyDevOpsSection />
      <WhatIBuildSection />
      <InteractiveSkillsSection />
      <CertificationsSection />
      <GitHubActivityWidget />
      <LatestPostsWidget maxPosts={6} showFeatured={true} />
      <CTASection />
    </>
  );
};

export default Home;