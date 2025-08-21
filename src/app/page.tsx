import Hero from "@/components/Hero";
import ApproachSection from "@/components/ApproachSection";
import ServicesSection from "@/components/ServicesSection";

const Home = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <ServicesSection />
      <ApproachSection />
    </div>
  );
};

export default Home;