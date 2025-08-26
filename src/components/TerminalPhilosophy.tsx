"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Code2, Lightbulb, Target } from 'lucide-react';

const philosophyPoints = [
  {
    command: "cat philosophy/learning.md",
    output: [
      "# Learning by Doing",
      "",
      "I believe in hands-on experience over theoretical knowledge.",
      "Every concept I learn gets tested in real projects.",
      "",
      "$ echo 'Build, break, fix, repeat' | tee -a learning.log"
    ],
    icon: <Code2 className="w-5 h-5" />
  },
  {
    command: "grep -r 'customer-first' mindset/",
    output: [
      "mindset/approach.txt: Always start with the customer problem",
      "mindset/solutions.txt: Technical elegance serves business value",
      "mindset/delivery.txt: Ship fast, iterate based on feedback",
      "",
      "3 matches found across mindset files"
    ],
    icon: <Target className="w-5 h-5" />
  },
  {
    command: "ls -la principles/",
    output: [
      "total 42",
      "drwxr-xr-x  2 dalton dalton  4096 Dec 2024 principles/",
      "-rw-r--r--  1 dalton dalton   512 Dec 2024 automation-first.sh",
      "-rw-r--r--  1 dalton dalton   256 Dec 2024 fail-fast.md",
      "-rw-r--r--  1 dalton dalton   384 Dec 2024 measure-everything.py",
      "-rw-r--r--  1 dalton dalton   128 Dec 2024 simple-scales.txt"
    ],
    icon: <Lightbulb className="w-5 h-5" />
  }
];

function TypewriterText({ 
  text, 
  speed = 30, 
  onComplete 
}: { 
  text: string; 
  speed?: number; 
  onComplete?: () => void; 
}) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return <span>{displayText}</span>;
}

function TerminalLine({ 
  command, 
  output, 
  delay = 0, 
  onComplete 
}: { 
  command: string; 
  output: string[]; 
  delay?: number; 
  onComplete?: () => void; 
}) {
  const [showCommand, setShowCommand] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [currentOutputLine, setCurrentOutputLine] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCommand(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const handleCommandComplete = () => {
    setTimeout(() => setShowOutput(true), 200);
  };

  const handleOutputLineComplete = () => {
    if (currentOutputLine < output.length - 1) {
      setTimeout(() => {
        setCurrentOutputLine(prev => prev + 1);
      }, 100);
    } else if (onComplete) {
      setTimeout(onComplete, 500);
    }
  };

  return (
    <div className="space-y-1">
      {showCommand && (
        <div className="flex items-center gap-2 text-green-400">
          <span className="text-blue-400">$</span>
          <TypewriterText 
            text={command} 
            speed={20}
            onComplete={handleCommandComplete}
          />
          <span className="animate-blink">|</span>
        </div>
      )}
      
      {showOutput && (
        <div className="pl-4 space-y-1">
          {output.slice(0, currentOutputLine + 1).map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className={`text-sm ${
                line.startsWith('#') 
                  ? 'text-yellow-400 font-semibold' 
                  : line.includes(':') && line.includes('.txt')
                  ? 'text-cyan-400'
                  : line.startsWith('drwx') || line.startsWith('-rw-')
                  ? 'text-gray-400'
                  : 'text-gray-300'
              }`}
            >
              {index === currentOutputLine && index === output.length - 1 ? (
                <TypewriterText 
                  text={line} 
                  speed={15}
                  onComplete={handleOutputLineComplete}
                />
              ) : (
                line
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TerminalPhilosophy() {
  const [activeTab, setActiveTab] = useState(0);
  const [showNextTab, setShowNextTab] = useState(false);

  const handleTabComplete = () => {
    if (activeTab < philosophyPoints.length - 1) {
      setTimeout(() => {
        setActiveTab(prev => prev + 1);
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/90 border-green-500/30 overflow-hidden">
        <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Terminal className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400 font-mono">dalton@philosophy:~</span>
          </div>
        </div>
        
        <CardContent className="p-6 bg-black text-green-400 font-mono text-sm min-h-[300px]">
          <div className="space-y-4">
            <div className="text-gray-400">
              Welcome to my development philosophy terminal
            </div>
            <div className="text-gray-400">
              Type 'help' for available commands
            </div>
            <div className="border-b border-gray-700 pb-2"></div>
            
            <AnimatePresence mode="wait">
              {philosophyPoints.slice(0, activeTab + 1).map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  <TerminalLine
                    command={point.command}
                    output={point.output}
                    delay={index * 100}
                    onComplete={index === activeTab ? handleTabComplete : undefined}
                  />
                  {index < philosophyPoints.length - 1 && index <= activeTab && (
                    <div className="border-b border-gray-800 my-4"></div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Philosophy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {philosophyPoints.map((point, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className={`h-full transition-all duration-300 ${
              index <= activeTab 
                ? 'border-primary/40 bg-primary/5' 
                : 'border-border/40'
            }`}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {point.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">
                      {point.command.includes('learning') ? 'Hands-on Learning' :
                       point.command.includes('customer') ? 'Customer-First Mindset' :
                       'Core Principles'}
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {point.command.includes('learning') 
                    ? 'I learn by building real projects and solving actual problems'
                    : point.command.includes('customer')
                    ? 'Every technical decision serves a business purpose and customer need'
                    : 'Simple, measurable, automated solutions that scale effectively'
                  }
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
