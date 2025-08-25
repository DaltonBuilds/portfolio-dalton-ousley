import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0d1117] text-white font-mono p-8 mt-12 rounded-t-lg border-t-2 border-[#30363d]">
      <div className="container mx-auto">
        <div className="flex flex-col space-y-4">
          <div>
            <span className="text-green-400">dalton@portfolio</span>
            <span className="text-gray-400">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-gray-400">$ </span>
            <span className="text-gray-200">ls -a pages</span>
          </div>
          <div className="flex space-x-6">
            <Link href="/" className="text-white hover:text-orange-400 transition-colors duration-200 terminal-cursor-hover">home</Link>
            <Link href="/about" className="text-white hover:text-orange-400 transition-colors duration-200 terminal-cursor-hover">about</Link>
            <Link href="/projects" className="text-white hover:text-orange-400 transition-colors duration-200 terminal-cursor-hover">projects</Link>
            <Link href="/#blog" className="text-white hover:text-orange-400 transition-colors duration-200 terminal-cursor-hover">blog</Link>
          </div>

          <div className="pt-4">
            <span className="text-green-400">dalton@portfolio</span>
            <span className="text-gray-400">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-gray-400">$ </span>
            <span className="text-gray-200">ls -a social</span>
          </div>
          <div className="flex space-x-6">
            <a href="https://github.com/DaltonBuilds" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-400 transition-colors duration-200 terminal-cursor-hover">github</a>
            <a href="https://linkedin.com/in/daltonousley" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-400 transition-colors duration-200 terminal-cursor-hover">linkedin</a>
            <a href="https://twitter.com/DaltonOusley" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-400 transition-colors duration-200 terminal-cursor-hover">twitter</a>
          </div>
          
          <div className="pt-4">
            <span className="text-green-400">dalton@portfolio</span>
            <span className="text-gray-400">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-gray-400">$ </span>
            <span className="inline-block w-2 h-5 bg-white animate-blink"></span>
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