import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
  command?: string; // Technical command to display as a tag
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  className,
  command,
}) => {
  return (
    <div className={cn("flex items-center justify-center flex-col mb-8 mt-12", className)}>
      {command && (
        <div className="mb-3">
          <code className="font-mono bg-secondary/20 text-secondary-foreground px-3 py-1 rounded-full text-sm border border-border/30">
            {command}
          </code>
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2 relative pb-2 text-center break-words max-w-full overflow-hidden">
        {Icon && <Icon size={36} className="inline-block mr-3 text-primary" />}
        <span className="inline-block">{title}</span>
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-secondary rounded-full"></span>
      </h2>
      {subtitle && <p className="mt-4 text-lg text-muted-foreground">{`> ${subtitle}`}</p>}
    </div>
  );
};

export default SectionHeader;