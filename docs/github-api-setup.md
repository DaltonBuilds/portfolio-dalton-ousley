# GitHub API Configuration

## Overview

The GitHub Activity Widget fetches public activity data via a server-side API route to keep authentication tokens secure and avoid rate limiting issues.

## Architecture

```
Client (GitHubActivityWidget.tsx)
    ↓ fetch('/api/github-activity')
Server API Route (/api/github-activity/route.ts)
    ↓ fetch with GITHUB_TOKEN
GitHub API
```

## Rate Limits

- **Without token**: 60 requests/hour per IP
- **With token**: 5,000 requests/hour

The widget caches responses for 5 minutes and polls every 10 minutes, so it uses ~6 requests/hour.

## Setup (Optional)

### Local Development

1. Create a GitHub Personal Access Token:
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - No scopes needed (we only read public data)
   - Copy the token

2. Add to `.env.local`:
   ```bash
   GITHUB_TOKEN=ghp_your_token_here
   ```

### Cloudflare Pages Deployment

1. Go to your Cloudflare Pages project settings
2. Navigate to "Settings" → "Environment variables"
3. Add variable:
   - **Name**: `GITHUB_TOKEN`
   - **Value**: Your GitHub token
   - **Environment**: Production (and Preview if desired)

## Security

✅ **Secure**: Token is stored as `GITHUB_TOKEN` (server-side only)
❌ **Insecure**: Never use `NEXT_PUBLIC_GITHUB_TOKEN` (would expose to client)

The API route runs on the edge/server, so the token never reaches the browser.

## Error Handling

The widget gracefully handles:
- Rate limit exceeded (429) - hides widget until reset
- GitHub API errors - hides widget
- Network failures - hides widget

Check browser console for detailed error messages during development.

## Testing

Test the API route directly:
```bash
curl http://localhost:3000/api/github-activity
```

Expected response:
```json
{
  "totalCommits": 42,
  "commitsThisWeek": 7,
  "totalRepos": 5,
  "recentActivity": [...]
}
```
