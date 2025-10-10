'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import mermaid from 'mermaid'

interface MermaidProps {
  chart: string
}

export function Mermaid({ chart }: MermaidProps) {
  const { theme, resolvedTheme } = useTheme()
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        // Get the current theme (resolved theme takes priority)
        const currentTheme = resolvedTheme || theme || 'light'
        const isDark = currentTheme === 'dark'

        // Initialize mermaid with theme-aware configuration
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          themeVariables: {
            darkMode: isDark,
            background: isDark ? '#1f2937' : '#ffffff',
            primaryColor: isDark ? '#3b82f6' : '#2563eb',
            primaryTextColor: isDark ? '#e5e7eb' : '#1f2937',
            primaryBorderColor: isDark ? '#4b5563' : '#d1d5db',
            lineColor: isDark ? '#6b7280' : '#9ca3af',
            secondaryColor: isDark ? '#1f2937' : '#f3f4f6',
            tertiaryColor: isDark ? '#374151' : '#f9fafb',
            fontSize: '16px',
          },
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
          },
          sequence: {
            useMaxWidth: true,
            showSequenceNumbers: true,
          },
        })

        // Render the diagram
        const { svg: renderedSvg } = await mermaid.render(idRef.current, chart)
        setSvg(renderedSvg)
        setError(null)
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError(err instanceof Error ? err.message : 'Failed to render diagram')
      }
    }

    renderDiagram()
  }, [chart, theme, resolvedTheme])

  if (error) {
    return (
      <div className="my-6 p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950 dark:border-red-800">
        <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">
          Mermaid Diagram Error
        </p>
        <pre className="text-xs text-red-600 dark:text-red-400 overflow-x-auto">
          {error}
        </pre>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="my-6 flex justify-center items-center overflow-x-auto p-4 bg-muted/30 border rounded-lg"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

