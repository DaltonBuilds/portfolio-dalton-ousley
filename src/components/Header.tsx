import Link from 'next/link';
import React from 'react';
import { ThemeToggle } from "./ThemeToggle";
import { Home, Info, Briefcase, Code, Rss, Mail } from 'lucide-react'; // Importing Lucide icons

const Header: React.FC = () => {
  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Experience', href: '/experience', icon: Briefcase },
    { name: 'Projects', href: '/projects', icon: Code },
    { name: 'Blog', href: '/blog', icon: Rss },
    { name: 'Contact', href: '/contact', icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/70 backdrop-blur-md transition-all duration-300 border-b border-blue-500/20">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <div className="text-lg font-bold bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">
          Dalton Ousley
        </div>
        <nav>
          <ul className="flex space-x-4 md:space-x-6">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="flex items-center text-primary hover:text-orange-500 hover:underline underline-offset-4 transition-colors duration-200">
                  <item.icon size={18} className="mr-1" /> {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="theme-toggle-placeholder">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;