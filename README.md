# AI Trend Auto Publisher

A full-stack Next.js App Router starter for an API-driven automation workflow that:

- fetches trending topics
- generates AI metadata
- creates images
- posts content
- stores publishing history

## Project Structure

```text
/src
  /app
    /dashboard
    /history
    /api
      /trends
      /generate
      /image
      /post
  /lib
    trends.ts
    ai.ts
    image.ts
    post.ts
    storage.ts
  /components
    Card.tsx
    Navbar.tsx

/data
  posts.json
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

- `TREND_SOURCE_URL`
- `OPENAI_API_KEY`
- `IMAGE_API_KEY`
- `PUBLISH_API_KEY`
- `PUBLISH_API_URL`
- `CRON_SECRET`

## GitHub Actions Scheduler

The workflow at `.github/workflows/scheduler.yml` is prepared to call `POST /api/post` on a schedule. Add these repository secrets:

- `APP_URL`
- `CRON_SECRET`
