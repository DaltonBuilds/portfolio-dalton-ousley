import Hero from "@/components/Hero";
import WhatIBuildSection from "@/components/WhatIBuildSection";
import WhyDevOpsSection from "@/components/WhyDevOpsSection";
import { InteractiveSkillsSection } from "@/components/InteractiveSkillsSection";
import { CertificationsSection } from "@/components/CertificationsSection";
import { LatestPostsWidget } from "@/components/blog/LatestPostsWidget";

const Home = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <WhatIBuildSection />
      <InteractiveSkillsSection />
      <CertificationsSection />
      <LatestPostsWidget />
      <WhyDevOpsSection />
    </div>
  );
};

export default Home;