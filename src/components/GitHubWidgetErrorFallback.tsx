'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Activity } from 'lucide-react';
import { siteConfig } from '@/config/site.config';

interface GitHubWidgetErrorFallbackProps {
  error: Error;
  reset: () => void;
}

/**
 * Custom error fallback UI for the GitHub Activity Widget
 * Provides a widget-specific error message and recovery options
 */
export const GitHubWidgetErrorFallback: React.FC<GitHubWidgetErrorFallbackProps> = ({
  error,
  reset,
}) => {
  return (
    <section className="section-padding">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
          GitHub <span className="gradient-text">Activity</span>
        </h2>
        <Card className="glass p-8 text-center">
          <Activity className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Unable to load GitHub activity
          </h3>
          <p className="text-muted-foreground mb-4">
            The GitHub activity widget encountered an error. You can still view my work directly on GitHub.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-4 text-left">
              <summary className="text-sm font-medium text-foreground cursor-pointer hover:underline">
                Error details (development only)
              </summary>
              <div className="mt-2 p-3 bg-background/50 rounded border border-border">
                <p className="text-xs font-mono text-destructive break-all">
                  {error.toString()}
                </p>
              </div>
            </details>
          )}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
              aria-label="Retry loading GitHub activity"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try again
            </button>
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md transition-colors"
            >
              View on GitHub
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </Card>
      </div>
    </section>
  );
};
