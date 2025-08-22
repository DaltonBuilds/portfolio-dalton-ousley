import React from 'react';
import Link from 'next/link';
import { Server, Database, GitMerge, Users, Network } from 'lucide-react';

const FooterSecondary: React.FC = () => {
  return (
    <footer className="w-full bg-gray-900 text-white p-8 mt-4 rounded-t-lg border-t-2 border-gray-700">
      <div className="container mx-auto text-center">
        <h3 className="text-xl font-bold mb-8">Portfolio Architecture</h3>
        <div className="flex justify-center items-center space-x-8 md:space-x-16">
          
          {/* User Icon */}
          <div className="flex flex-col items-center">
            <Users className="text-blue-400" size={48} />
            <p className="mt-2 text-sm">Users</p>
          </div>

          <div className="text-gray-500 text-2xl font-mono">&rarr;</div>

          {/* API Gateway */}
          <Link href="/#services" className="flex flex-col items-center hover:text-orange-400 transition-colors">
            <Network className="text-purple-400" size={48} />
            <p className="mt-2 text-sm">Services</p>
            <p className="text-xs text-gray-400">(API Gateway)</p>
          </Link>
          
          <div className="text-gray-500 text-2xl font-mono">&rarr;</div>

          {/* Compute/Projects */}
          <Link href="/#projects" className="flex flex-col items-center hover:text-orange-400 transition-colors">
            <Server className="text-green-400" size={48} />
            <p className="mt-2 text-sm">Projects</p>
            <p className="text-xs text-gray-400">(Compute)</p>
          </Link>
          
          <div className="text-gray-500 text-2xl font-mono">&rarr;</div>

          {/* Database */}
          <Link href="/#experience" className="flex flex-col items-center hover:text-orange-400 transition-colors">
            <Database className="text-yellow-400" size={48} />
            <p className="mt-2 text-sm">Experience</p>
            <p className="text-xs text-gray-400">(Database)</p>
          </Link>

          <div className="text-gray-500 text-2xl font-mono">&rarr;</div>

          {/* CI/CD */}
          <Link href="/#skills" className="flex flex-col items-center hover:text-orange-400 transition-colors">
            <GitMerge className="text-red-400" size={48} />
            <p className="mt-2 text-sm">Skills</p>
            <p className="text-xs text-gray-400">(CI/CD)</p>
          </Link>

        </div>
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>A visual representation of this portfolio&apos;s structure.</p>
          <p>&copy; {new Date().getFullYear()} Dalton Ousley. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSecondary;
