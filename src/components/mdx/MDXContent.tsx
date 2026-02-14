'use client'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { MDXProvider } from '@mdx-js/react'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { CodeBlock } from './CodeBlock'
import { Callout } from './Callout'
import { CustomImage } from './CustomImage'
import { CodeBlockCopy } from './CodeBlockCopy'
import { useMDXComponents } from '@/config/mdx-components'

// Dynamically import Mermaid to reduce initial bundle size
// Mermaid is ~200KB+ and only needed for blog posts with diagrams
const Mermaid = dynamic(() => import('./Mermaid').then(mod => ({ default: mod.Mermaid })), {
  loading: () => (
    <div className="flex items-center justify-center p-8 bg-muted/30 rounded-lg border border-border">
      <div className="animate-pulse text-muted-foreground">Loading diagram...</div>
    </div>
  ),
  ssr: false,
})

const baseComponents = {
  // Custom components
  CodeBlock,
  Callout,
  Image: CustomImage,
  Mermaid, // Make Mermaid available to MDX
  
  // Override default elements
  pre: ({ children, ...props }: React.ComponentProps<'pre'>) => {
    // Extract code block props from children if it's a code element
    const child = children as React.ReactElement<{ children: string; className?: string }>
    if (child?.props?.children && typeof child.props.children === 'string') {
      const code = child.props.children
      const language = child.props.className?.replace('language-', '') || 'text'
      return <CodeBlock language={language} code={code} {...props} />
    }
    return <pre {...props}>{children}</pre>
  },
  
  code: ({ children, className, ...props }: React.ComponentProps<'code'>) => {
    // Treat as inline if there's no language class (some MDX compilers add className to inline code)
    const isInline = !className || !/\blanguage-/.test(className)
    if (isInline) {
      return (
        <code
          className={`inline-code not-prose before:content-none after:content-none inline-flex items-center rounded-md px-1.5 py-0.5 font-mono text-[0.9em] ${className ?? ''}`}
          {...props}
        >
          {children}
        </code>
      )
    }
    // Block code will be handled by the pre element override above
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },

  // Enhanced elements with proper anchor links
  h1: ({ children, id, ...props }: React.ComponentProps<'h1'>) => (
    <h1 
      id={id}
      className="scroll-m-20 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 group break-words"
      {...props}
    >
      {children}
    </h1>
  ),
  
  h2: ({ children, id, ...props }: React.ComponentProps<'h2'>) => (
    <h2 
      id={id}
      className="scroll-m-20 border-b pb-2 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-6 mt-10 group break-words"
      {...props}
    >
      {children}
    </h2>
  ),
  
    h3: ({ children, id, ...props }: React.ComponentProps<'h3'>) => (
    <h3
      id={id}
      className="scroll-m-20 text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight mb-4 mt-8 group break-words"
      {...props}
    >
      {children}
    </h3>
  ),

  h4: ({ children, id, ...props }: React.ComponentProps<'h4'>) => (
    <h4 
      id={id}
      className="scroll-m-20 text-xl font-semibold tracking-tight mb-3 mt-6 group"
      {...props}
    >
      {children}
    </h4>
  ),

  p: ({ children, ...props }: React.ComponentProps<'p'>) => (
    <p className="leading-7 mb-6 text-foreground" {...props}>
      {children}
    </p>
  ),

  ul: ({ children, ...props }: React.ComponentProps<'ul'>) => (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-foreground" {...props}>
      {children}
    </ul>
  ),

  ol: ({ children, ...props }: React.ComponentProps<'ol'>) => (
    <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 text-foreground" {...props}>
      {children}
    </ol>
  ),

  li: ({ children, ...props }: React.ComponentProps<'li'>) => (
    <li className="text-foreground" {...props}>
      {children}
    </li>
  ),

  blockquote: ({ children, ...props }: React.ComponentProps<'blockquote'>) => (
    <blockquote className="mt-6 border-l-2 border-primary pl-6 italic text-muted-foreground bg-muted/30 py-2 rounded-r" {...props}>
      {children}
    </blockquote>
  ),

  a: ({ children, href, className, ...props }: React.ComponentProps<'a'>) => {
    // Special case: heading anchor links from slug/autolink should not open new tabs or be underlined
    if (className === 'anchor') {
      return (
        <a
          href={href}
          className="text-primary hover:text-primary/80 no-underline"
          {...props}
        >
          {children}
        </a>
      )
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-orange-500 underline underline-offset-2 decoration-2 hover:text-orange-600 dark:text-orange-500 dark:hover:text-orange-600 transition-colors ${className ?? ''}`}
        {...props}
      >
        {children}
      </a>
    )
  },

  strong: ({ children, ...props }: React.ComponentProps<'strong'>) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),

  em: ({ children, ...props }: React.ComponentProps<'em'>) => (
    <em className="italic text-muted-foreground" {...props}>
      {children}
    </em>
  ),

  hr: ({ ...props }: React.ComponentProps<'hr'>) => (
    <hr className="my-8 border-border" {...props} />
  ),

  table: ({ children, ...props }: React.ComponentProps<'table'>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full border-collapse border border-border" {...props}>
        {children}
      </table>
    </div>
  ),

  thead: ({ children, ...props }: React.ComponentProps<'thead'>) => (
    <thead className="bg-muted" {...props}>
      {children}
    </thead>
  ),

  tbody: ({ children, ...props }: React.ComponentProps<'tbody'>) => (
    <tbody {...props}>
      {children}
    </tbody>
  ),

  tr: ({ children, ...props }: React.ComponentProps<'tr'>) => (
    <tr className="m-0 border-t border-border p-0 even:bg-muted/30" {...props}>
      {children}
    </tr>
  ),

  th: ({ children, ...props }: React.ComponentProps<'th'>) => (
    <th className="border border-border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right" {...props}>
      {children}
    </th>
  ),

  td: ({ children, ...props }: React.ComponentProps<'td'>) => (
    <td className="border border-border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right" {...props}>
      {children}
    </td>
  ),
}

// Merge base components with configuration components
const components = useMDXComponents(baseComponents)

interface MDXContentProps {
  code: string
}

export function MDXContent({ code }: MDXContentProps) {
  const MDXComponent = useMemo(() => {
    try {
      // Velite compiles MDX to JSX runtime code
      // We need to evaluate it with the proper JSX runtime
      const func = new Function('arguments', code)
      return func([{ Fragment, jsx, jsxs }]).default
    } catch (error) {
      console.error('Error rendering MDX:', error)
      const ErrorComponent = () => (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950 dark:border-red-800">
          <p className="text-red-700 dark:text-red-300">
            Error rendering content. Please check the console for details.
          </p>
        </div>
      )
      ErrorComponent.displayName = 'MDXErrorComponent'
      return ErrorComponent
    }
  }, [code])

  return (
    <MDXProvider components={components}>
      <CodeBlockCopy />
      <div className="prose prose-gray dark:prose-invert max-w-none prose-sm sm:prose-base md:prose-lg prose-pre:p-0 prose-pre:m-0 prose-pre:bg-transparent prose-pre:overflow-visible prose-code:whitespace-pre">
        <MDXComponent components={components} />
      </div>
    </MDXProvider>
  )
}
