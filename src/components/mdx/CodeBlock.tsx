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
    <div className="blog-code-block relative group w-full min-w-0 overflow-hidden">
      {/* Header with filename and copy button */}
      {(filename || codeContent) && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border border-b-0 rounded-t-lg">
          {filename && (
            <span className="text-sm font-mono text-muted-foreground">
              {filename}
            </span>
          )}
          <div className="flex items-center gap-2">
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
      
      {/* Code content */}
      <pre 
        className={`
          w-full min-w-0 overflow-x-auto p-4 bg-muted/30 border rounded-lg
          ${filename || codeContent ? 'rounded-t-none' : ''}
          ${className || ''}
        `}
        {...props}
      >
        <code className={`font-mono text-sm ${language ? `language-${language}` : ''}`}>
          {children || code}
        </code>
      </pre>
    </div>
  )
}
