# News Module Dynamic Content Exploration

## Overview

The daana-2025 project is a SvelteKit-based website for Houdou Temple. It uses microCMS as a headless CMS to manage dynamic content, particularly for news and projects.

## Dynamic Content Modules Found

### 1. News Module (`src/lib/news/`)

**Structure:**

- Domain Layer: `domain/schema.ts` - Defines NewsItem schema with valibot
- Infrastructure Layer: `infra/client.ts` + `infra/repository.ts` - Handles microCMS API communication
- Application Layer: `app/get-news.ts`, `app/get-news-post.ts`, etc. - Business logic
- Remote Functions: `news.remote.ts` - SvelteKit remote functions for client-server data fetching

**microCMS API Endpoint:**

- Base URL: `https://samgha.microcms.io/api/v1/`
- News endpoint: `news/`

**NewsItem Schema Fields:**

- `id`: string (primary identifier)
- `title`: string
- `content`: string (optional)
- `thumbnail`: object with url, width, height
- `publishedAt`: ISO timestamp
- `pinned`: boolean (optional) - for featured news
- `createdAt`, `updatedAt`, `revisedAt`: ISO timestamps

**Available API Methods:**

1. `getNews(offset, limit, fields)` - List news with pagination
2. `getNewsById(id)` - Fetch individual news post by ID
3. `getPinnedNews(limit, fields)` - Fetch pinned/featured news
4. `getTotalCount()` - Get total number of news items

**Remote Functions in news.remote.ts:**

- `getNewsSectionPrerender()` - Top page section (3 items with content)
- `getNewsListPrerender()` - News list initial load (10 items)
- `getNewsTotalCountPrerender()` - Get total count
- `getPinnedNewsPrerender()` - Pinned news (5 items)
- `getNewsRemote()` - Query version for pagination
- `getPinnedNewsRemote()` - Query version for pinned news

### 2. Projects Module (`src/lib/projects/`)

**Structure:** Similar DDD structure to news module

- Domain Layer: `domain/schema.ts`
- Infrastructure Layer: `infra/repository.ts`
- Application Layer: `app/get-projects.ts`
- Remote Functions: `projects.remote.ts`

**microCMS API Endpoint:**

- Projects endpoint: `projects/`

**ProjectItem Schema Fields:**

- `id`: string (primary identifier)
- `title`: string
- `projectLink`: string (URL)
- `type`: array of ProjectType ('mono' | 'hito')
- `body`: string (optional)
- `publishedAt`, `createdAt`, `updatedAt`, `revisedAt`: ISO timestamps

**Available API Methods:**

1. `getProjects(fields)` - List all projects

**Remote Functions in projects.remote.ts:**

- `getProjectsPrerender()` - Prerender projects list

## Dynamic Routes

### News Route

- **Pattern:** `/news/[slug]`
- **File:** `/Users/takuya/ghq/github.com/dev-komenzar/daana-2025/src/routes/news/[slug]/+page.server.ts`
- **Implementation:**
  - Uses `params.slug` to match the news ID from microCMS
  - Calls `getNewsPost(slug)` to fetch individual news item
  - Returns 404 if news post not found
  - Uses server-side load function: `+page.server.ts`

**URL Pattern for News Posts:** `/news/{news-id}`

- Example: `/news/post-123`
- The slug parameter maps directly to the microCMS news ID

### Projects Route

- **No dynamic route found** - Projects are only displayed in a list on `/donation` section
- Projects use `projectLink` field to link to external URLs (not internal dynamic pages)

## Static Routes

- Homepage: `/`
- News list: `/news/`
- Donation: `/donation/`
- Passion: `/passion/`
- Interview (Ryugen): `/interview-ryugen/`
- Interview (Kuramoto): `/interview-kuramoto/`
- Temple: `/temple/`
- Vision: `/vision/`
- Action: `/action/`

## Key Points for Sitemap Generation

1. **News Pages:** Need to fetch all news items from microCMS to generate dynamic URLs
   - URL pattern: `/news/{id}`
   - Requires API call to get all news IDs: `news?limit=999&fields=id`

2. **Projects:** Currently NOT a dynamic route
   - Projects use external links via `projectLink` field
   - No individual project pages

3. **microCMS Configuration:**
   - API Key: `MICROCMS_API_KEY` from environment
   - Base URL: `https://samgha.microcms.io/api/v1/`
   - Uses ky HTTP client with custom headers

4. **SvelteKit Setup:**
   - Using adapter-auto (Vercel deployment)
   - Remote functions enabled: `experimental.remoteFunctions: true`
   - No explicit prerendering configuration found yet

## Implementation Notes

- The news module uses the repository pattern for data access
- API calls are server-side only (remote functions)
- microCMS responses are validated with valibot schemas
- Error handling: Returns empty arrays on API failures
- API is only called if `MICROCMS_API_KEY` is configured

## Next Steps for Sitemap

1. Create a sitemap.xml.ts or similar route to generate sitemap
2. Fetch all news IDs from microCMS
3. Include static routes + dynamic news routes
4. Consider lastmod from news publishedAt/updatedAt fields
