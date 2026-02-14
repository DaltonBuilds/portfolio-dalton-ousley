'use client'

import { OptimizedImage } from '@/components/OptimizedImage'

interface CustomImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  caption?: string
  sizes?: string
}

export function CustomImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  caption,
  sizes,
  ...props 
}: CustomImageProps) {
  return (
    <figure className="my-8">
      <div className="relative overflow-hidden rounded-lg border bg-muted">
        <OptimizedImage
          src={src}
          alt={alt}
          width={width || 800}
          height={height || 600}
          className={`w-full h-auto ${className}`}
          sizes={sizes || "(max-width: 800px) 100vw, 800px"}
          {...props}
        />
      </div>
      
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
