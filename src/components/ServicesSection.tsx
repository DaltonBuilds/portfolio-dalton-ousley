import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Eye, Code, Briefcase, Users, Send } from 'lucide-react';

const servicesData = [
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Client-First Approach",
    description: "Building trust through transparent communication and collaboration.",
  },
  {
    icon: <Briefcase className="w-8 h-8 text-primary" />,
    title: "Global Flexibility",
    description: "Available across time zones for seamless worldwide collaboration.",
  },
  {
    icon: <Eye className="w-8 h-8 text-primary" />,
    title: "Technical Stack",
    description: "Click to see detailed technology breakdown",
    isFeatured: true,
  },
  {
    icon: <Code className="w-8 h-8 text-primary" />,
    title: "AI-Powered Solutions",
    description: "Specializing in intelligent automation and LLM integrations.",
  },
  {
    icon: <Send className="w-8 h-8 text-primary" />,
    title: "Ready to Collaborate",
    description: "Let's create something amazing together",
  },
];

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="section-padding">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <Card
              key={index}
              className={`
                bg-card/50 border border-border/20 backdrop-blur-sm transition-all duration-300 
                hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10
                flex flex-col items-center text-center p-8
                ${service.isFeatured ? 'lg:col-start-2 glow-border' : ''}
              `}
            >
              <div className="mb-4">{service.icon}</div>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/60">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
