import React from 'react';
import { cn } from '@/lib/utils';

interface TouchTargetProps {
  children: React.ReactNode;
  minSize?: number;
  as?: React.ElementType;
  className?: string;
  [key: string]: any;
}

/**
 * TouchTarget component ensures interactive elements meet minimum touch target size
 * requirements (44x44px by default) for mobile accessibility.
 * 
 * If the visual size of the child element is smaller than the minimum size,
 * this component adds invisible padding to reach the minimum touch target area.
 * 
 * @example
 * <TouchTarget minSize={44}>
 *   <button className="w-8 h-8">X</button>
 * </TouchTarget>
 */
export function TouchTarget({
  children,
  minSize = 44,
  as: Component = 'div',
  className,
  ...props
}: TouchTargetProps) {
  // Calculate the minimum size in rem (assuming 16px base font size)
  const minSizeRem = minSize / 16;

  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center',
        className
      )}
      style={{
        minWidth: `${minSizeRem}rem`,
        minHeight: `${minSizeRem}rem`,
        ...props.style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
