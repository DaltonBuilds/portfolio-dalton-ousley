'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps extends Omit<ImageProps, 'placeholder' | 'blurDataURL'> {
  /**
   * Whether to show a loading state while the image loads
   * @default true
   */
  showLoadingState?: boolean
  
  /**
   * Whether to use blur placeholder
   * @default true
   */
  useBlurPlaceholder?: boolean
  
  /**
   * Custom blur data URL (base64 encoded image)
   * If not provided, Next.js will generate one automatically for static imports
   */
  blurDataURL?: string
  
  /**
   * Whether to use fill mode (for responsive containers)
   */
  fill?: boolean
}

/**
 * OptimizedImage component wraps Next.js Image with sensible defaults
 * for optimal performance and user experience.
 * 
 * Features:
 * - Automatic WebP/AVIF format with fallbacks (handled by Next.js)
 * - Blur placeholder support for better perceived performance
 * - Loading state indicator
 * - Responsive sizing with sizes attribute
 * - Lazy loading by default (unless priority is set)
 * 
 * Requirements: 8.1, 8.3, 8.5
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  sizes,
  priority = false,
  className = '',
  showLoadingState = true,
  useBlurPlaceholder = true,
  blurDataURL,
  fill = false,
  onLoad,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Determine placeholder strategy
  // Only use blur placeholder if blurDataURL is provided or src is a static import
  const isStaticImport = typeof src === 'object'
  const canUseBlur = useBlurPlaceholder && (isStaticImport || blurDataURL)
  
  const placeholderProps = canUseBlur
    ? {
        placeholder: 'blur' as const,
        ...(blurDataURL && { blurDataURL }),
      }
    : { placeholder: 'empty' as const }

  // Default sizes if not provided
  const defaultSizes = sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false)
    onLoad?.(e)
  }

  return (
    <div className="relative w-full h-full">
      {showLoadingState && isLoading && !priority && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse rounded-lg">
          <span className="sr-only">Loading image: {alt}</span>
        </div>
      )}
      
      <Image
        src={src}
        alt={alt}
        {...(fill ? { fill: true } : { width, height })}
        sizes={defaultSizes}
        priority={priority}
        className={`transition-opacity duration-300 ${
          isLoading && !priority ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        onLoad={handleLoad}
        {...placeholderProps}
        {...props}
      />
    </div>
  )
}
