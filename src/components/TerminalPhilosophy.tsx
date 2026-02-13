"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { Code2, Lightbulb, Target } from 'lucide-react';

const philosophyPoints = [
  {
    title: 'Hands-on Learning',
    description: 'I learn by building real projects and solving actual problems',
    icon: Code2,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20 hover:border-blue-500/40',
    shadowColor: 'hover:shadow-blue-500/10',
    command: "cat philosophy/learning.md",
    output: "Build, break, fix, repeat. Every concept gets tested in production."
  },
  {
    title: 'Customer-First Mindset',
    description: 'Every technical decision serves a business purpose and customer need',
    icon: Target,
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20 hover:border-orange-500/40',
    shadowColor: 'hover:shadow-orange-500/10',
    command: "grep -r 'value' mindset/",
    output: "Technical elegance serves business value, not the other way around."
  },
  {
    title: 'Core Principles',
    description: 'Simple, measurable, automated solutions that scale effectively',
    icon: Lightbulb,
    iconColor: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20 hover:border-yellow-500/40',
    shadowColor: 'hover:shadow-yellow-500/10',
    command: "ls principles/",
    output: "automation-first.sh  fail-fast.md  measure-everything.py  simple-scales.txt"
  }
];

export function TerminalPhilosophy() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Terminal Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full overflow-hidden rounded-lg border border-blue-500/50 bg-[#0b1220] text-gray-200 shadow-xl shadow-blue-500/20"
      >
        <div className="flex items-center justify-between border-b border-blue-500/30 bg-[#0d1526] px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-blue-200/70 truncate">dalton@philosophy:~</span>
        </div>
        
        <div className="px-4 py-4 font-mono text-xs sm:text-sm space-y-4">
          {philosophyPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.4 }}
              className="space-y-1"
            >
              <div className="text-blue-300">$ {point.command}</div>
              <div className="text-blue-100/90 pl-2">{point.output}</div>
              {index < philosophyPoints.length - 1 && (
                <div className="border-b border-blue-500/20 my-3"></div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Philosophy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {philosophyPoints.map((point, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className={`h-full ${point.borderColor} transition-all duration-300 hover:shadow-lg ${point.shadowColor}`}>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg ${point.bgColor} flex items-center justify-center ${point.iconColor}`}>
                    <point.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-base">{point.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {point.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
