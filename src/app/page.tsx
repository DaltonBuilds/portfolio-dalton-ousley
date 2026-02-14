import Hero from "@/components/Hero";
import WhyDevOpsSection from "@/components/WhyDevOpsSection";
import WhatIBuildSection from "@/components/WhatIBuildSection";
import { InteractiveSkillsSection } from "@/components/InteractiveSkillsSection";
import { CertificationsSection } from "@/components/CertificationsSection";
import GitHubActivityWidget from "@/components/GitHubActivityWidget";
import { LatestPostsWidget } from "@/components/blog/LatestPostsWidget";
import CTASection from "@/components/CTASection";

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