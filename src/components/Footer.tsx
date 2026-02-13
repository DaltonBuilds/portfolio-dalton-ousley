import React from 'react';
import Link from 'next/link';

import { siteConfig } from '@/config/site.config'
import CredlyBadge from './CredlyBadge';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0d1117] text-white font-mono p-8 mt-12 rounded-t-lg border-t-2 border-[#30363d]" role="contentinfo">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
        <div className="flex flex-col space-y-4">
          <div>
            <span className="text-green-400">dalton@portfolio</span>
            <span className="text-gray-400">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-gray-400">$ </span>
            <span className="text-gray-200">ls -a pages</span>
          </div>
          <nav aria-label="Footer navigation">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/" className="text-white hover:text-orange-400 transition-colors duration-200 terminal-cursor-hover focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-[#0d1117] rounded-sm px-1 py-0.5">home</Link>
              <Link href="/about" className="text-white hover:text-orange-400 transition-colors duration-200 terminal-cursor-hover focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-[#0d1117] rounded-sm px-1 py-0.5">about</Link>
              <Link href="/experience" className="text-white hover:text-orange-400 transition-colors duration-200 terminal-cursor-hover focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-[#0d1117] rounded-sm px-1 py-0.5">experience</Link>
              <Link href="/projects" className="text-white hover:text-orange-400 transition-colors duration-200 terminal-cursor-hover focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-[#0d1117] rounded-sm px-1 py-0.5">projects</Link>
              <Link href="/blog" className="text-white hover:text-orange-400 transition-colors duration-200 terminal-cursor-hover focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-[#0d1117] rounded-sm px-1 py-0.5">blog</Link>
            </div>
          </nav>

          <div className="pt-4">
            <span className="text-green-400">dalton@portfolio</span>
            <span className="text-gray-400">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-gray-400">$ </span>
            <span className="text-gray-200">ls -a social</span>
          </div>
          <nav aria-label="Social media links">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-400 transition-colors duration-200 terminal-cursor-hover focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-[#0d1117] rounded-sm px-1 py-0.5" aria-label="Visit Dalton's GitHub profile (opens in new tab)">github</a>
              <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-400 transition-colors duration-200 terminal-cursor-hover focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-[#0d1117] rounded-sm px-1 py-0.5" aria-label="Visit Dalton's LinkedIn profile (opens in new tab)">linkedin</a>
            </div>
          </nav>
          
          <div className="pt-4">
            <span className="text-green-400">dalton@portfolio</span>
            <span className="text-gray-400">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-gray-400">$ </span>
            <span className="text-gray-200">ls -a legal</span>
          </div>
          <nav aria-label="Legal links">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 terminal-cursor-hover focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-[#0d1117] rounded-sm px-1 py-0.5">privacy-policy</Link>
              <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 terminal-cursor-hover focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-[#0d1117] rounded-sm px-1 py-0.5">terms-of-use</Link>
            </div>
          </nav>
          
          <div className="pt-4">
            <span className="text-green-400">dalton@portfolio</span>
            <span className="text-gray-400">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-gray-400">$ </span>
            <span className="inline-block w-2 h-5 bg-white animate-blink"></span>
          </div>
        </div>
        
        {/* Certifications Section */}
        <div className="flex flex-col items-center lg:items-end space-y-3">

          <div className="flex flex-wrap gap-3 justify-center lg:justify-end">
            <CredlyBadge width={90} height={90} />
            {/* Future certifications will go here */}
            {/* <CKABadge width={90} height={90} /> */}
            {/* <LPIC1Badge width={90} height={90} /> */}
          </div>
        </div>
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Dalton Ousley. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;