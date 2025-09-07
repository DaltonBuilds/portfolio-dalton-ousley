'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { 
  AlignJustify, 
  User, 
  Briefcase, 
  FolderOpen, 
  PenTool,
  X,
  Mail
} from 'lucide-react';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from "@/components/ui/Button";
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

import { siteConfig } from '@/config/site.config'

const Header: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { name: 'About', href: siteConfig.nav.about, icon: User },
    { name: 'Experience', href: siteConfig.nav.experience, icon: Briefcase },
    { name: 'Projects', href: siteConfig.nav.projects, icon: FolderOpen },
    { name: 'Blog', href: siteConfig.nav.blog, icon: PenTool },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2" aria-label="Dalton Ousley - Home">
          <div className="w-6 h-6 bg-primary rounded-full" aria-hidden="true" />
          <span className="font-bold text-lg">Dalton Ousley</span>
        </Link>
        <nav className="hidden md:flex" aria-label="Main navigation">
          <ul className="flex items-center space-x-6 text-md font-medium">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`relative terminal-cursor-hover transition-colors hover:text-foreground/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-2 py-1 ${
                    pathname === item.href ? 'text-foreground' : 'text-foreground/60'
                  }`}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button className="hidden sm:inline-flex" aria-label="Contact Dalton Ousley">
            Get in Touch
          </Button>
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open menu">
                  <AlignJustify className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[300px] sm:w-[350px] p-0 border-0 bg-gradient-to-br from-[#f97316] via-[#f97316]/90 to-[#3b82f6] dark:from-[#f97316] dark:via-[#f97316]/80 dark:to-[#3b82f6] [&>button]:hidden"
              >
                <SheetTitle className="sr-only">
                  Navigation Menu
                </SheetTitle>
                
                {/* Custom close button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute left-6 top-6 z-10 rounded-full p-2 text-white hover:text-white hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
                
                <div className="flex flex-col h-full text-white relative overflow-hidden">
                  {/* Decorative background elements */}
                  <div className="absolute top-20 right-10 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
                  <div className="absolute bottom-40 left-8 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
                  
                  {/* Header */}
                  <div className="pt-20 pb-8 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden backdrop-blur-sm border border-white/30">
                        <Image
                          src="/dalton-ousley-profile-pic.webp"
                          alt="Dalton Ousley"
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-bold text-xl text-white">Menu</span>
                    </div>
                  </div>
                  
                  {/* Navigation */}
                  <nav className="flex-1 px-6" aria-label="Mobile navigation">
                    <div className="flex flex-col gap-2" role="list">
                      {navItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={handleLinkClick}
                            className={`flex items-center space-x-4 rounded-xl px-4 py-4 text-base font-medium transition-all duration-200 min-h-[56px] focus:outline-none focus:ring-2 focus:ring-white/50 ${
                              pathname === item.href
                                ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30'
                                : 'text-white/90 hover:text-white hover:bg-white/10'
                            }`}
                            aria-current={pathname === item.href ? 'page' : undefined}
                            role="listitem"
                          >
                            <IconComponent className="h-5 w-5 flex-shrink-0" />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </nav>
                  
                  {/* Footer */}
                  <div className="p-6 space-y-4">
                    <Link
                      href="mailto:example@gmail.com"
                      onClick={handleLinkClick}
                      className="flex items-center justify-center space-x-2 rounded-xl bg-white/20 text-white px-4 py-4 text-base font-medium transition-all duration-200 hover:bg-white/30 min-h-[56px] focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm border border-white/30"
                      aria-label="Contact Dalton Ousley via email"
                    >
                      <Mail className="h-5 w-5" />
                      <span>Get in Touch</span>
                    </Link>
                    
                    {/* Theme toggle and footer links */}
                    <div className="flex flex-col space-y-3 pt-4 border-t border-white/20">
                      <div className="flex justify-center">
                        <div className="bg-white/10 rounded-lg p-1 backdrop-blur-sm">
                          <ThemeToggle />
                        </div>
                      </div>
                      
                      {/* Footer links */}
                      <div className="flex flex-col space-y-2 text-sm text-white/70">
                        <button className="text-left hover:text-white transition-colors">
                          Terms of Service
                        </button>
                        <button className="text-left hover:text-white transition-colors">
                          Privacy Policy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;