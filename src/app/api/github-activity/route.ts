import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 300; // Cache for 5 minutes

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
    head?: string;
  };
}

export async function GET() {
  try {
    const githubUsername = 'DaltonBuilds'; // Could also come from config

    // Prepare headers with optional authentication
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'DaltonBuilds-Portfolio',
    };

    // Add GitHub token if available (server-side only, never exposed to client)
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // Fetch events from GitHub
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/events/public?per_page=100&page=1`,
      {
        headers,
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      // Check rate limit headers
      const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
      const rateLimitReset = response.headers.get('X-RateLimit-Reset');

      if (response.status === 403 && rateLimitRemaining === '0') {
        const resetTime = rateLimitReset
          ? new Date(parseInt(rateLimitReset) * 1000).toISOString()
          : 'unknown';

        console.warn(`GitHub API rate limit exceeded. Resets at ${resetTime}`);

        return NextResponse.json(
          {
            error: 'RATE_LIMIT',
            message: 'GitHub API rate limit exceeded',
            resetTime,
          },
          { status: 429 }
        );
      }

      console.error(`GitHub API error: ${response.status}`);
      return NextResponse.json(
        { error: 'GITHUB_API_ERROR', message: `GitHub API returned ${response.status}` },
        { status: response.status }
      );
    }

    const events: GitHubEvent[] = await response.json();

    // Validate response
    if (!Array.isArray(events)) {
      console.error('GitHub API did not return an array:', events);
      return NextResponse.json(
        { error: 'INVALID_RESPONSE', message: 'Invalid response from GitHub API' },
        { status: 500 }
      );
    }

    // Filter events from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentEvents = events.filter((e) => new Date(e.created_at) > thirtyDaysAgo);

    // Process events - count all commits from PushEvents
    const pushEvents = recentEvents.filter((e) => e.type === 'PushEvent');

    // Count commits this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    let commitsThisWeek = 0;
    pushEvents
      .filter((e) => new Date(e.created_at) > oneWeekAgo)
      .forEach((event) => {
        if (event.payload?.commits && Array.isArray(event.payload.commits)) {
          commitsThisWeek += event.payload.commits.length;
        } else {
          commitsThisWeek += 1;
        }
      });

    // Count total commits in last 30 days
    let totalCommits = 0;
    pushEvents.forEach((event) => {
      if (event.payload?.commits && Array.isArray(event.payload.commits)) {
        totalCommits += event.payload.commits.length;
      } else {
        totalCommits += 1;
      }
    });

    if (totalCommits === 0 && pushEvents.length > 0) {
      totalCommits = pushEvents.length;
    }

    // Count unique repos
    const uniqueRepos = new Set(recentEvents.map((e) => e.repo.name));

    // Helper to check if repo is DevOps-related
    const isDevOpsRepo = (repoName: string) => {
      const devOpsKeywords = [
        'gitops',
        'k8s',
        'kubernetes',
        'terraform',
        'ansible',
        'docker',
        'helm',
        'argocd',
        'homelab',
        'infra',
        'infrastructure',
        'cicd',
        'pipeline',
        'lab',
      ];
      return devOpsKeywords.some((keyword) => repoName.toLowerCase().includes(keyword));
    };

    // Get recent activity - filter to only show DevOps repos
    const recentActivity = events
      .filter((e) => ['PushEvent', 'CreateEvent'].includes(e.type))
      .filter((e) => isDevOpsRepo(e.repo.name))
      .slice(0, 8)
      .map((event) => {
        let message = '';
        let type = '';

        if (event.type === 'PushEvent') {
          type = 'commit';
          // Use commit message from payload if available
          if (
            event.payload?.commits &&
            Array.isArray(event.payload.commits) &&
            event.payload.commits.length > 0
          ) {
            message = event.payload.commits[0].message.split('\n')[0];
          } else {
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
          time: new Date(event.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          isDevOpsRepo: isDevOpsRepo(repoFullName),
        };
      });

    // Return processed data
    return NextResponse.json(
      {
        totalCommits,
        commitsThisWeek,
        totalRepos: uniqueRepos.size,
        recentActivity,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Failed to fetch GitHub activity:', error);
    return NextResponse.json(
      {
        error: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
