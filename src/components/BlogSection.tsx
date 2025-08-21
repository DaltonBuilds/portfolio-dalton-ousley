import React from 'react';
import SectionHeader from './SectionHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Rss, CalendarDays } from 'lucide-react';
import Link from 'next/link';

interface BlogPostProps {
  title: string;
  description: string;
  date: string;
  link: string;
}

const blogPosts: BlogPostProps[] = [
  {
    title: "The Future of Web Development with AI",
    description: "Exploring how artificial intelligence is shaping the landscape of modern web development and what to expect next.",
    date: "October 26, 2023",
    link: "#",
  },
  {
    title: "Mastering Server Components in Next.js 14",
    description: "A deep dive into React Server Components and their practical applications in Next.js App Router.",
    date: "September 15, 2023",
    link: "#",
  },
  {
    title: "Optimizing Performance: A Guide to Web Vitals",
    description: "Understand Core Web Vitals and implement strategies to improve your website's performance and user experience.",
    date: "August 01, 2023",
    link: "#",
  },
];

const BlogSection: React.FC = () => {
  return (
    <section id="blog" className="container mx-auto py-16 px-4">
      <SectionHeader title="My Blog" icon={Rss} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post, index) => (
          <Card 
            key={index} 
            className="flex flex-col border-2 border-blue-500 transform transition-all duration-300 hover:scale-[1.03] hover:border-orange-500 shadow-lg shadow-blue-500/20 hover:shadow-orange-500/30 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary mb-2 hover:text-secondary transition-colors duration-200">
                <Link href={post.link}>{post.title}</Link>
              </CardTitle>
              <CardDescription className="text-muted-foreground flex items-center">
                <CalendarDays size={16} className="mr-2 text-primary" /> {post.date}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-foreground/80 text-sm">{post.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="text-center mt-12">
        <Link href="#" className="text-primary hover:text-secondary underline text-lg font-medium transition-colors duration-200">
          View All Posts &rarr;
        </Link>
      </div>
    </section>
  );
};

export default BlogSection;