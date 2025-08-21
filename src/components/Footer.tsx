import React from 'react';
import { Linkedin, Github, Twitter } from 'lucide-react'; // Example social icons

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-blue-500 py-8 mt-12 shadow-inner shadow-blue-500/50">
      <div className="container mx-auto px-4 text-center text-white">
        <p>&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
        <div className="mt-6 flex justify-center space-x-6">
          <a href="#" className="text-white hover:text-orange-300 transition-colors duration-200" aria-label="LinkedIn">
            <Linkedin size={24} className="text-orange-400" />
          </a>
          <a href="#" className="text-white hover:text-orange-300 transition-colors duration-200" aria-label="GitHub">
            <Github size={24} className="text-orange-400" />
          </a>
          <a href="#" className="text-white hover:text-orange-300 transition-colors duration-200" aria-label="Twitter">
            <Twitter size={24} className="text-orange-400" />
          </a>
          {/* Add more social links as needed */}
        </div>
        <div className="mt-4 text-sm">
          <p>Email: your.email@example.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;