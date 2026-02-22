# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ほうどう寺のWEBサイト2025年版 - A website for Houdou Temple built with SvelteKit.

## Package Manager

Use **pnpm** for all package management tasks.

## Common Commands

### Development

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server
pnpm dev --open       # Start dev server and open in browser
pnpm build            # Build for production
pnpm preview          # Preview production build
```

### Type Checking

```bash
pnpm check            # Run svelte-check
pnpm check:watch      # Run svelte-check in watch mode
```

### Formatting

```bash
pnpm format           # Format all files with Prettier
```

### Linting

```bash
pnpm lint             # Lint and fix JS/TS/Svelte files with ESLint
pnpm lint:style       # Lint and fix CSS/Svelte styles with Stylelint
```

### Testing

```bash
npx vitest            # Run tests (vitest is available but no test scripts configured)
```

## Architecture

### Tech Stack

- **Framework**: SvelteKit with Svelte 5
- **Language**: TypeScript with strict mode
- **Styling**: Pure CSS (no CSS frameworks), **Mobile First** approach
- **HTTP Client**: ky
- **Validation**: valibot
- **Logging**: consola
- **Deployment**: Vercel (deployed from GitHub)

### Key SvelteKit Features in Use

- **Async Compiler** (`experimental.async: true` in svelte.config.js)
- **Remote Functions** (`experimental.remoteFunctions: true`) - Used for server-side data fetching via `query()` from `$app/server`

### Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── layout/      # Layout components (header, opening-layer)
│   │   └── ui/          # Reusable UI components (modal, cards)
│   ├── assets/          # Static assets
│   └── news/            # News module (DDD structure)
│       ├── domain/      # Business logic core
│       ├── infra/       # External service communication
│       ├── app/         # Use cases
│       └── news.remote.ts # SvelteKit remote functions
└── routes/
    ├── +page.svelte     # Homepage
    ├── +layout.svelte   # Root layout
    └── section-*.svelte # Page sections (mission, works, news, etc.)
```

### Data Fetching Architecture

The project uses **SvelteKit Remote Functions** for type-safe server-client data fetching, organized in a **Domain-Driven Design (DDD)** structure:

#### News Module (`src/lib/news/`)

```
src/lib/news/
├── domain/           # Business logic core
│   ├── schema.ts     # NewsItemSchema, type definitions
│   ├── repository.ts # INewsRepository interface
│   └── index.ts
├── infra/            # External service communication
│   ├── client.ts     # ky HTTP client for microCMS
│   ├── repository.ts # INewsRepository implementation
│   └── index.ts
├── app/              # Use cases
│   ├── get-news.ts
│   ├── get-news-post.ts
│   ├── get-news-total-count.ts
│   ├── get-pinned-news.ts
│   └── index.ts
├── news.remote.ts    # SvelteKit remote functions
└── index.ts          # Public API
```

#### Layer Responsibilities

1. **Domain Layer** (`domain/`): Schema definitions with valibot, repository interface, pure TypeScript types
2. **Infrastructure Layer** (`infra/`): microCMS HTTP client, repository implementation with API calls
3. **Application Layer** (`app/`): Use case functions that orchestrate domain and infra
4. **Remote Functions** (`news.remote.ts`): SvelteKit `prerender()` and `query()` for client-server communication

#### Usage Patterns

```typescript
// Type definitions (client/server)
import type { NewsItem } from '$lib/news'

// Remote functions (from components)
import { getNewsSectionPrerender, getPinnedNewsPrerender } from '$lib/news/news.remote'

// Server-side only (+page.server.ts)
import { getNewsPost } from '$lib/news/app'
```

**Important**: Remote function files must have `.remote` in the filename to work in subdirectories

### Environment Variables

Required environment variable:

- `MICROCMS_API_KEY`: API key for microCMS (set in `.env`)

### Font Configuration

- **English**: Futura
- **Japanese**: Noto Sans JP (downloaded from Google Fonts, stored in `static/fonts/`)
- Font weights are specified by font-family name (e.g., 'Noto Sans JP Light') rather than using variable fonts

### Code Quality Tools

- **Prettier**: Code formatter (tabs, no semicolons, single quotes)
- **ESLint**: Extended with perfectionist, svelte, and unicorn plugins
- **Stylelint**: Uses standard config with recess-order and HTML support
- **Husky + lint-staged**: Pre-commit hooks run Prettier and linting automatically
- **svelte-check**: Type-checking for Svelte components

### Image Handling

- **Static assets**: Use `EnhancedImage` component (`src/lib/components/ui/enhanced-image.svelte`) instead of raw `<img>` tags
  - Automatically converts images to AVIF/WebP formats
  - Generates multiple sizes for responsive images
  - Prevents layout shift by auto-setting width/height
  - Images must be imported from `$lib/assets/`
- **External URLs** (e.g., microCMS): Use standard `<img>` tags with explicit `width` and `height` attributes

### Important Notes

- All routes are organized as section components imported into the main page
- The project uses Svelte 5's latest features
- microCMS is used as the headless CMS for content management
- Remote functions require server-side execution; they cannot run in pure client context

### CSS Architecture - Mobile First

This project uses a **Mobile First** approach for responsive design:

- **Default styles**: Written for mobile devices (smallest viewport)
- **Media queries**: Use `@media screen and (width >= 768px)` to add styles for larger screens
- **Breakpoints**:
  - Mobile: default (< 768px)
  - Tablet and above: `width >= 768px`

```css
/* Mobile First Example */
.element {
	padding: 24px; /* Mobile default */
	font-size: 14px;
}

@media screen and (width >= 768px) {
	.element {
		padding: 48px; /* Tablet and above */
		font-size: 16px;
	}
}
```

**Important**: Do NOT use `max-width` or `width < 768px` media queries. Always start with mobile styles and progressively enhance for larger screens.

### Space Handling

General principles for managing spacing between elements:

- **Uniform spacing (siblings/children)**: Use the owl selector (`* + *`) to apply consistent margins between adjacent sibling elements
- **Non-uniform spacing**:
  - **Vertical spacing**: Apply margin/padding to the **bottom element** (use `margin-top` on the element below)
  - **Horizontal spacing**: Apply margin/padding to the **right element** (use `margin-left` on the element to the right)

```html
<div class="my-class"></div>
<div class="your-class"></div>
```

- Spacing such structure, use `my-class + your-calss` selector to indicate that this selector relates to two factors.

### Scroll Animations

Use the `floatUp` Svelte action for scroll-triggered "floating up" animations. This action uses the Motion library (`motion.dev`) which is already installed in the project.

**Location**: `src/lib/actions/float-up.ts`

**Usage**:

```svelte
<script>
	import { floatUp } from '$lib/actions'
</script>

<h2 use:floatUp>タイトル</h2><p use:floatUp>コンテンツ</p><div use:floatUp={{ translateY: 10, bounce: 0.5 }}>カスタム設定</div>
```

**Animation Effect**:

- Fade in (opacity: 0 → 1)
- Translate up (Y: 6px → 0)
- Scale up with spring (scale: 0.98 → 1)
- Triggers on both viewport enter and exit

**Available Options**:
| Option | Default | Description |
|--------|---------|-------------|
| `translateY` | 6 | Y-axis movement in px |
| `scaleFrom` | 0.98 | Initial scale value |
| `bounce` | 0.3 | Spring bounce for scale |
| `durationEnter` | 0.5 | Enter animation duration (seconds) |
| `durationExit` | 0.35 | Exit animation duration (seconds) |
| `threshold` | 0.3 | Viewport visibility ratio to trigger (0-1) |

**Important**: When adding scroll animations to new pages, follow the pattern used in `src/routes/interview-ryugen/+page.svelte`.
