import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  className,
}) => {
  return (
    <div className={cn("flex items-center justify-center flex-col mb-8 mt-12", className)}>
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2 relative pb-2 text-center break-words max-w-full overflow-hidden">
        {Icon && <Icon size={36} className="inline-block mr-3 text-primary" />}
        <span className="inline-block">
          {title.startsWith('cat ') || title.startsWith('ls ') || title.startsWith('grep ') ? (
            <code className="font-mono bg-secondary/20 px-2 py-1 rounded text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl break-all">{title}</code>
          ) : (
            title
          )}
        </span>
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-secondary rounded-full"></span>
      </h2>
      {subtitle && <p className="mt-4 text-lg text-muted-foreground">{`> ${subtitle}`}</p>}
    </div>
  );
};

export default SectionHeader;