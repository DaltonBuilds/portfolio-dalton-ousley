"use client";

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { GitCommit, GitPullRequest, Star, GitFork, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { siteConfig } from '@/config/site.config';

interface GitHubStats {
  totalCommits: number;
  commitsThisWeek: number;
  totalRepos: number;
  recentActivity: Array<{
    type: string;
    repo: string;
    repoFullName: string;
    message: string;
    time: string;
    isDevOpsRepo: boolean;
  }>;
}

const GitHubActivityWidget: React.FC = () => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGitHubActivity = async () => {
      try {
        // Fetch from our API route instead of GitHub directly
        const response = await fetch('/api/github-activity', {
          next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!response.ok) {
          if (response.status === 429) {
            const data = await response.json();
            console.warn('GitHub API rate limit exceeded:', data);
            throw new Error('RATE_LIMIT');
          }
          throw new Error(`API error: ${response.status}`);
        }

        const data: GitHubStats = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch GitHub activity:', error);

        // If rate limited, log and hide widget
        if (error instanceof Error && error.message === 'RATE_LIMIT') {
          console.warn('GitHub API rate limit reached. Widget will retry later.');
        }

        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubActivity();

    // Refetch every 10 minutes
    const interval = setInterval(fetchGitHubActivity, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
            GitHub <span className="gradient-text">Activity</span>
          </h2>
          <Card className="glass p-8 text-center">
            <Activity className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Loading activity...</p>
          </Card>
        </div>
      </section>
    );
  }

  if (!stats) {
    return null;
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'commit':
        return <GitCommit className="w-4 h-4" />;
      case 'pr':
        return <GitPullRequest className="w-4 h-4" />;
      case 'create':
        return <Star className="w-4 h-4" />;
      default:
        return <GitFork className="w-4 h-4" />;
    }
  };

  return (
    <section className="section-padding">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
          GitHub <span className="gradient-text">Activity</span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <Card className="glass p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <GitCommit className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Recent Commits</h3>
            </div>
            <p className="text-4xl font-bold text-foreground">{stats.totalCommits}</p>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </Card>

          <Card className="glass p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-green-500" />
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">This Week</h3>
            </div>
            <p className="text-4xl font-bold text-foreground">{stats.commitsThisWeek}</p>
            <p className="text-xs text-muted-foreground mt-1">Commits pushed</p>
          </Card>

          <Card className="glass p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <GitFork className="w-5 h-5 text-purple-500" />
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Active Repos</h3>
            </div>
            <p className="text-4xl font-bold text-foreground">{stats.totalRepos}</p>
            <p className="text-xs text-muted-foreground mt-1">Contributing to</p>
          </Card>
        </div>

        {/* Recent Activity Feed - Terminal Style */}
        <Card className="glass p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 font-mono">
            <Activity className="w-5 h-5 text-primary" />
            git log --oneline --graph
          </h3>
          <div className="space-y-2 font-mono text-sm">
            {stats.recentActivity.map((activity, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 p-2 rounded hover:bg-background/50 transition-colors group"
              >
                {/* Git graph line */}
                <div className="flex items-center gap-1 text-primary shrink-0">
                  <span className="text-primary">*</span>
                  {index < stats.recentActivity.length - 1 && (
                    <span className="text-primary/30">|</span>
                  )}
                </div>
                
                {/* Commit hash (fake but looks authentic) */}
                <span className="text-amber-500 shrink-0 w-16">
                  {Math.random().toString(36).substring(2, 9)}
                </span>
                
                {/* Icon */}
                <div className="text-primary shrink-0">
                  {getEventIcon(activity.type)}
                </div>
                
                {/* Message */}
                <p className="text-foreground/80 truncate flex-1 min-w-0 group-hover:text-foreground transition-colors">
                  {activity.message}
                </p>
                
                {/* Repo badge with DevOps highlight */}
                <Badge 
                  variant="outline" 
                  className={`text-xs shrink-0 font-mono transition-colors ${
                    activity.isDevOpsRepo 
                      ? 'border-orange-500/70 bg-orange-500/20 text-orange-400 font-semibold' 
                      : 'border-border'
                  }`}
                >
                  {activity.repo}
                </Badge>
                
                {/* Time */}
                <span className="text-muted-foreground text-xs shrink-0 w-16 text-right">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
          
          {/* Bottom actions */}
          <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
              <span>Showing {stats.recentActivity.length} recent events</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Updated just now</span>
            </div>
            <a 
              href={siteConfig.social.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1 font-mono"
            >
              View on GitHub
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default GitHubActivityWidget;
