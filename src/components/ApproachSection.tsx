import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const approachData = [
  {
    phase: 1,
    title: "Planning & Strategy",
    description: "I'll collaborate to map out your goals, target audience, and key functionalities. We'll discuss things like site structure, navigation, and content requirements.",
  },
  {
    phase: 2,
    title: "Development & Progress Update",
    description: "Once we agree on the plan, I'll dive into coding. From initial sketches to polished code, I keep you updated every step of the way.",
  },
  {
    phase: 3,
    title: "Deployment & Launch",
    description: "This is where the magic happens! I'll translate everything into functional code, building your website from the ground up and deploying it to the cloud.",
  },
];

const ApproachSection: React.FC = () => {
  return (
    <section id="approach" className="section-padding">
      <div className="container mx-auto px-4">
        <h2 className="section-header mb-12">
          My <span className="gradient-text">Approach</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {approachData.map((item, index) => (
            <Card key={index} className="bg-card/50 border border-border/20 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">{item.title}</CardTitle>
                  <div className="text-5xl font-extrabold text-primary/20">
                    0{item.phase}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/60">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApproachSection;
