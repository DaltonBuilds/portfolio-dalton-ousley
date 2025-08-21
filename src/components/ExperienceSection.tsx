import React from 'react';
import SectionHeader from './SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Briefcase, Calendar } from 'lucide-react';

interface ExperienceItemProps {
  title: string;
  company: string;
  duration: string;
  description: string[];
}

const experience: ExperienceItemProps[] = [
  {
    title: "Senior Front-End Engineer",
    company: "InnovateTech Solutions",
    duration: "Jan 2022 - Present",
    description: [
      "Led the development of a new customer-facing dashboard using Next.js and Tailwind CSS, improving user engagement by 25%.",
      "Mentored junior developers on best practices for React component design and state management.",
      "Collaborated with UX/UI designers to translate wireframes and mockups into high-fidelity web interfaces.",
    ],
  },
  {
    title: "Front-End Developer",
    company: "WebWorks Agency",
    duration: "Jul 2019 - Dec 2021",
    description: [
      "Developed and maintained responsive websites for various clients, ensuring cross-browser compatibility.",
      "Implemented new features and optimized existing codebase for improved performance and scalability.",
      "Participated in code reviews and contributed to the continuous improvement of development processes.",
    ],
  },
  {
    title: "Junior Web Developer",
    company: "Startup Hub",
    duration: "Sep 2017 - Jun 2019",
    description: [
      "Assisted in the development of front-end components for a SaaS product using React and Redux.",
      "Debugged and resolved front-end issues, collaborating with backend engineers.",
      "Gained experience with version control (Git) and agile development methodologies.",
    ],
  },
];

const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="container mx-auto py-16 px-4">
      <SectionHeader title="My Experience" icon={Briefcase} />
      <div className="grid grid-cols-1 gap-8">
        {experience.map((item, index) => (
          <Card 
            key={index} 
            className="border-2 border-blue-500 transform transition-all duration-300 hover:scale-[1.02] hover:border-orange-500 shadow-lg shadow-blue-500/20 hover:shadow-orange-500/30 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-primary">{item.title}</CardTitle>
              <CardDescription className="text-secondary flex items-center">
                <Briefcase size={16} className="mr-2" /> {item.company}
              </CardDescription>
              <CardDescription className="text-muted-foreground flex items-center">
                <Calendar size={16} className="mr-2" /> {item.duration}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-foreground/80">
                {item.description.map((desc, idx) => (
                  <li key={idx}>{desc}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;