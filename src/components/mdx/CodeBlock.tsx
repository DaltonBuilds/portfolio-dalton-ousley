'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface CodeBlockProps {
  children?: React.ReactNode
  language?: string
  code?: string
  filename?: string
  className?: string
}

export function CodeBlock({ 
  children, 
  language = 'text', 
  code, 
  filename,
  className,
  ...props 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  
  // Extract code content
  const codeContent = code || (typeof children === 'string' ? children : '')
  
  const copyToClipboard = async () => {
    if (codeContent) {
      await navigator.clipboard.writeText(codeContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="blog-code-block relative group w-full min-w-0">
      {/* Header with filename and copy button */}
      {(filename || codeContent) && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border border-b-0 rounded-t-lg overflow-hidden">
          {filename && (
            <span className="text-sm font-mono text-muted-foreground truncate">
              {filename}
            </span>
          )}
          <div className="flex items-center gap-2 flex-shrink-0">
            {language && language !== 'text' && (
              <span className="text-xs uppercase font-mono text-muted-foreground">
                {language}
              </span>
            )}
            {codeContent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            )}
          </div>
        </div>
      )}
      
      {/* Code content with proper scrolling */}
      <div className="relative overflow-hidden rounded-lg">
        <pre 
          className={`
            w-full overflow-x-auto overflow-y-hidden p-4 bg-muted/30 border
            ${filename || codeContent ? 'rounded-t-none border-t-0' : 'rounded-lg'}
            scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent
            hover:scrollbar-thumb-muted-foreground/50
            ${className || ''}
          `}
          {...props}
        >
          <code className={`font-mono text-sm whitespace-pre ${language ? `language-${language}` : ''}`}>
            {children || code}
          </code>
        </pre>
      </div>
    </div>
  )
}
