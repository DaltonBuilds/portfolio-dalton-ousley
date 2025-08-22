import Hero from "@/components/Hero";
import ApproachSection from "@/components/ApproachSection";
import ServicesSection from "@/components/ServicesSection";
import { InteractiveSkillsSection } from "@/components/InteractiveSkillsSection";

const Home = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <ServicesSection />
      <InteractiveSkillsSection />
      <ApproachSection />
    </div>
  );
};

export default Home;