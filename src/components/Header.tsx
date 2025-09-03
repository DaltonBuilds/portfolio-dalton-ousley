'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from "@/components/ui/Button";
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

const Header: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { name: 'About', href: '/about' },
    { name: 'Experience', href: '/experience' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between">
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
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
                <SheetTitle className="sr-only">
                  Navigation Menu
                </SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary rounded-full" />
                      <span className="font-bold text-lg">Menu</span>
                    </div>
                  </div>
                  
                  {/* Navigation */}
                  <nav className="flex-1 p-6" aria-label="Mobile navigation">
                    <div className="flex flex-col gap-2" role="list">
                      {navItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={handleLinkClick}
                          className={`flex items-center rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                            pathname === item.href
                              ? 'bg-accent text-accent-foreground shadow-sm'
                              : 'text-foreground/70 hover:text-foreground'
                          }`}
                          aria-current={pathname === item.href ? 'page' : undefined}
                          role="listitem"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </nav>
                  
                  {/* Footer */}
                  <div className="p-6 border-t bg-muted/30">
                    <Link
                      href="mailto:example@gmail.com"
                      onClick={handleLinkClick}
                      className="flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 py-3 text-base font-medium transition-colors hover:bg-primary/90 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2"
                      aria-label="Contact Dalton Ousley via email"
                    >
                      Get in Touch
                    </Link>
                    <div className="mt-4 flex justify-center">
                      <ThemeToggle />
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