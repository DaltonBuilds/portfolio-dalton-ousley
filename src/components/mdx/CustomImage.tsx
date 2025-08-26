'use client'

import Image from 'next/image'
import { useState } from 'react'

interface CustomImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  caption?: string
}

export function CustomImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  caption,
  ...props 
}: CustomImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <figure className="my-8">
      <div className="relative overflow-hidden rounded-lg border bg-muted">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading image...</div>
          </div>
        )}
        
        <Image
          src={src}
          alt={alt}
          width={width || 800}
          height={height || 600}
          className={`w-full h-auto transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${className}`}
          onLoad={() => setIsLoading(false)}
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
