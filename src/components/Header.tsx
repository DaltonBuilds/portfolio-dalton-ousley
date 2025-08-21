'use client';
import Link from 'next/link';
import React from 'react';
import { Button } from "@/components/ui/Button";
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

const Header: React.FC = () => {
  const pathname = usePathname();
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Experience', href: '/experience' },
    { name: 'Projects', href: '/projects' },
    { name: 'Case Studies', href: '/case-studies' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary rounded-full" />
          <span className="font-bold text-lg">Dalton Ousley</span>
        </Link>
        <nav className="hidden md:flex">
          <ul className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`transition-colors hover:text-foreground/80 ${
                    pathname === item.href ? 'text-foreground' : 'text-foreground/60'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button>
            Get in Touch
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;