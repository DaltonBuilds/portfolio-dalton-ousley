import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  icon?: LucideIcon;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon: Icon,
  className,
}) => {
  return (
    <div className={cn("flex items-center justify-center flex-col mb-8 mt-12", className)}>
      <h2 className="text-4xl font-bold text-primary mb-2 relative pb-2">
        {Icon && <Icon size={36} className="inline-block mr-3 text-primary" />}
        {title}
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-secondary rounded-full"></span>
      </h2>
    </div>
  );
};

export default SectionHeader;