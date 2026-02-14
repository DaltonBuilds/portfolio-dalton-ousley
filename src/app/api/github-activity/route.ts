import { createApiResponse, createApiError, handleApiError } from '@/lib/api/error-handling';
import { fetchWithTimeout, TimeoutError } from '@/lib/api/fetch-with-timeout';

export const runtime = 'edge';
export const revalidate = 300; // Cache for 5 minutes

// GitHub widget specific timeout (5 seconds)
const GITHUB_WIDGET_TIMEOUT_MS = 5000;

// Cache configuration
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CachedResponse {
  data: any;
  timestamp: number;
}

// In-memory cache (simple implementation for edge runtime)
let cache: CachedResponse | null = null;

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
    // Check cache first
    const now = Date.now();
    if (cache && (now - cache.timestamp) < CACHE_TTL_MS) {
      console.log('Returning cached GitHub activity data');
      return createApiResponse(
        {
          ...cache.data,
          cached: true,
          cachedAt: cache.timestamp,
        },
        200
      );
    }

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

    // Fetch events from GitHub with timeout
    const response = await fetchWithTimeout(
      `https://api.github.com/users/${githubUsername}/events/public?per_page=100&page=1`,
      {
        headers,
        next: { revalidate: 300 }, // Cache for 5 minutes
      },
      GITHUB_WIDGET_TIMEOUT_MS
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

        return createApiError(
          'GitHub API rate limit exceeded',
          429,
          { resetTime }
        );
      }

      console.error(`GitHub API error: ${response.status}`);
      return createApiError(
        `GitHub API returned ${response.status}`,
        response.status >= 500 ? 502 : response.status
      );
    }

    const events: GitHubEvent[] = await response.json();

    // Validate response
    if (!Array.isArray(events)) {
      console.error('GitHub API did not return an array:', events);
      return createApiError('Invalid response from GitHub API', 500);
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
    const responseData = {
      totalCommits,
      commitsThisWeek,
      totalRepos: uniqueRepos.size,
      recentActivity,
    };
    
    // Store in cache
    cache = {
      data: responseData,
      timestamp: Date.now(),
    };
    
    return createApiResponse(
      {
        ...responseData,
        cached: false,
      },
      200
    );
  } catch (error) {
    console.error('Failed to fetch GitHub activity:', error);
    
    // Handle timeout errors specifically
    if (error instanceof TimeoutError) {
      // If we have cached data (even if stale), return it with stale indicator
      if (cache) {
        console.log('Timeout occurred, returning stale cached data');
        return createApiResponse(
          {
            ...cache.data,
            cached: true,
            stale: true,
            cachedAt: cache.timestamp,
          },
          200
        );
      }
      
      return createApiError(
        'GitHub API request timed out',
        504,
        { message: 'The request took too long to complete. Please try again later.' }
      );
    }
    
    // For other errors, also try to return stale cache if available
    if (cache) {
      console.log('Error occurred, returning stale cached data');
      return createApiResponse(
        {
          ...cache.data,
          cached: true,
          stale: true,
          cachedAt: cache.timestamp,
        },
        200
      );
    }
    
    return handleApiError(error);
  }
}
