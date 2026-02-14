'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function BlogPostError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Blog post error:', error)
    }
  }, [error])

  // In production, hide internal error details
  const isProduction = process.env.NODE_ENV === 'production'

  // Extract helpful information from error message
  const getErrorDetails = () => {
    const message = error.message || ''
    
    // Check for common MDX parsing errors
    if (message.includes('Expected')) {
      return {
        type: 'MDX Syntax Error',
        suggestion: 'Check for unclosed tags, missing brackets, or invalid JSX syntax in your MDX file.',
      }
    }
    
    if (message.includes('frontmatter') || message.includes('metadata')) {
      return {
        type: 'Frontmatter Validation Error',
        suggestion: 'Verify that all required frontmatter fields (title, date) are present and correctly formatted.',
      }
    }
    
    if (message.includes('Cannot find module') || message.includes('import')) {
      return {
        type: 'Import Error',
        suggestion: 'Check that all imported components or modules exist and are correctly referenced.',
      }
    }
    
    return {
      type: 'Content Error',
      suggestion: 'Review the error message below for specific details about what went wrong.',
    }
  }

  const errorDetails = getErrorDetails()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 py-8">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-4">
          {isProduction ? 'Content Error' : errorDetails.type}
        </h1>
        
        <p className="text-muted-foreground mb-6">
          {isProduction
            ? 'We encountered an error loading this blog post. The content may be temporarily unavailable.'
            : 'There was an error parsing or rendering this blog post.'}
        </p>

        {/* Development mode: Show detailed error information */}
        {!isProduction && (
          <div className="space-y-4 mb-6">
            {/* Error message */}
            {error.message && (
              <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg text-left">
                <h3 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-2">
                  Error Message:
                </h3>
                <p className="text-sm font-mono text-red-900 dark:text-red-100 break-words whitespace-pre-wrap">
                  {error.message}
                </p>
              </div>
            )}

            {/* Suggestion */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg text-left">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                💡 Suggestion:
              </h3>
              <p className="text-sm text-blue-900 dark:text-blue-100">
                {errorDetails.suggestion}
              </p>
            </div>

            {/* Stack trace */}
            {error.stack && (
              <details className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-left">
                <summary className="text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer">
                  Stack Trace (click to expand)
                </summary>
                <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 mt-2 overflow-x-auto whitespace-pre-wrap break-words">
                  {error.stack}
                </pre>
              </details>
            )}

            {/* Common fixes */}
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-left">
              <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                Common Fixes:
              </h3>
              <ul className="text-sm text-yellow-900 dark:text-yellow-100 space-y-1 list-disc list-inside">
                <li>Ensure all required frontmatter fields are present (title, date)</li>
                <li>Check that the date field is in ISO 8601 format (YYYY-MM-DD)</li>
                <li>Verify all JSX tags are properly closed</li>
                <li>Confirm imported components are available</li>
                <li>Check for syntax errors in code blocks</li>
              </ul>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} variant="default">
            Try Again
          </Button>
          <Button asChild variant="outline">
            <Link href="/blog">View All Posts</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
