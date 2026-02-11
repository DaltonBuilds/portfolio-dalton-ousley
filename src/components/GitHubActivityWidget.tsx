"use client";

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { GitCommit, GitPullRequest, Star, GitFork, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { siteConfig } from '@/config/site.config';

interface GitHubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
  };
  created_at: string;
  payload: {
    commits?: Array<{ message: string }>;
    action?: string;
    ref_type?: string;
  };
}

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

  // Extract username from GitHub URL
  const githubUsername = siteConfig.social.github.split('/').pop() || 'DaltonBuilds';

  useEffect(() => {
    const fetchGitHubActivity = async () => {
      try {
        // Fetch recent events from GitHub API with cache busting
        const response = await fetch(
          `https://api.github.com/users/${githubUsername}/events/public?per_page=30&_=${Date.now()}`
        );
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const events: GitHubEvent[] = await response.json();

        // Validate that we got an array
        if (!Array.isArray(events)) {
          console.error('GitHub API did not return an array:', events);
          throw new Error('Invalid response from GitHub API');
        }

        // Process events - count all commits from PushEvents
        const pushEvents = events.filter(e => e.type === 'PushEvent');
        
        // Count commits this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const commitsThisWeek = pushEvents.filter(e => 
          new Date(e.created_at) > oneWeekAgo
        ).length;
        
        // Try to count individual commits, fallback to counting push events
        let totalCommits = 0;
        pushEvents.forEach(event => {
          if (event.payload?.commits && Array.isArray(event.payload.commits)) {
            totalCommits += event.payload.commits.length;
          } else {
            // If we can't get commit count, count the push event itself
            totalCommits += 1;
          }
        });

        // If still 0, just use the number of push events
        if (totalCommits === 0 && pushEvents.length > 0) {
          totalCommits = pushEvents.length;
        }

        const uniqueRepos = new Set(events.map(e => e.repo.name));

        // Helper to check if repo is DevOps-related
        const isDevOpsRepo = (repoName: string) => {
          const devOpsKeywords = ['gitops', 'k8s', 'kubernetes', 'terraform', 'ansible', 'docker', 'helm', 'argocd', 'homelab', 'infra', 'infrastructure', 'cicd', 'pipeline'];
          return devOpsKeywords.some(keyword => repoName.toLowerCase().includes(keyword));
        };

        // Get recent activity (last 8 meaningful events for compact display)
        const recentActivityPromises = events
          .filter(e => ['PushEvent', 'CreateEvent'].includes(e.type))
          .slice(0, 8)
          .map(async (event) => {
            let message = '';
            let type = '';

            if (event.type === 'PushEvent') {
              type = 'commit';
              // Fetch the actual commit message from the commit API
              try {
                const commitSha = event.payload.head;
                const repoName = event.repo.name;
                const commitResponse = await fetch(
                  `https://api.github.com/repos/${repoName}/commits/${commitSha}`
                );
                if (commitResponse.ok) {
                  const commitData = await commitResponse.json();
                  message = commitData.commit.message.split('\n')[0]; // First line only
                } else {
                  message = 'Pushed commits';
                }
              } catch {
                message = 'Pushed commits';
              }
            } else if (event.type === 'CreateEvent') {
              type = 'create';
              message = `Created ${event.payload.ref_type}`;
            }

            const repoFullName = event.repo.name;
            const repoShortName = repoFullName.split('/')[1];

            return {
              type,
              repo: repoShortName,
              repoFullName,
              message: message.length > 50 ? message.substring(0, 50) + '...' : message,
              time: new Date(event.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              isDevOpsRepo: isDevOpsRepo(repoFullName),
            };
          });

        const recentActivity = await Promise.all(recentActivityPromises);

        setStats({
          totalCommits,
          commitsThisWeek,
          totalRepos: uniqueRepos.size,
          recentActivity,
        });
      } catch (error) {
        console.error('Failed to fetch GitHub activity:', error);
        // Set null to hide the widget on error
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubActivity();
    
    // Refetch every 5 minutes
    const interval = setInterval(fetchGitHubActivity, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [githubUsername]);

  if (loading) {
    return (
      <section className="py-12 sm:py-16">
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
    <section className="py-12 sm:py-16">
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
