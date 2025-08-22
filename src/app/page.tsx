import Hero from "@/components/Hero";
import ApproachSection from "@/components/ApproachSection";
import ServicesSection from "@/components/ServicesSection";
import { InteractiveSkillsSection } from "@/components/InteractiveSkillsSection";
import { CertificationsSection } from "@/components/CertificationsSection";

const Home = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <ServicesSection />
      <InteractiveSkillsSection />
      <CertificationsSection />
      <ApproachSection />
    </div>
  );
};

export default Home;