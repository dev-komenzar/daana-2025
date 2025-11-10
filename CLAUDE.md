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
- **Styling**: Pure CSS (no CSS frameworks)
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
│   ├── cms.ts           # microCMS client and schema definitions
│   ├── client.ts        # ky HTTP client configuration with microCMS headers
│   └── news.remote.ts   # Remote function for news fetching
└── routes/
    ├── +page.svelte     # Homepage
    ├── +layout.svelte   # Root layout
    └── section-*.svelte # Page sections (mission, works, news, etc.)
```

### Data Fetching Architecture

The project uses **SvelteKit Remote Functions** for type-safe server-client data fetching:

1. **HTTP Client** (`src/lib/client.ts`): Configured ky instance with microCMS API credentials from environment variables (`MICROCMS_API_KEY`)

2. **Schema & API Layer** (`src/lib/cms.ts`):
   - Defines `NewsItemSchema` using valibot
   - Exports `getNewsAsync()` function for fetching news from microCMS
   - Handles validation and error logging with consola

3. **Remote Function** (`src/lib/news.remote.ts`):
   - Uses `query()` from `$app/server` to create type-safe remote functions
   - Validates input parameters with valibot
   - Wraps `getNewsAsync()` for client-side consumption

4. **Component Usage**: Call `getNewsRemote()` from client components to fetch data

### Environment Variables

Required environment variable:
- `MICROCMS_API_KEY`: API key for microCMS (set in `.env`)

### Font Configuration

- **English**: Futura
- **Japanese**: Noto Sans JP (downloaded from Google Fonts, stored in `static/fonts/`)
- Font weights are specified by font-family name (e.g., 'Noto Sans JP Light') rather than using variable fonts

### Code Quality Tools

- **ESLint**: Extended with perfectionist, svelte, and unicorn plugins
- **Stylelint**: Uses standard config with recess-order and HTML support
- **Husky + lint-staged**: Pre-commit hooks run linting automatically
- **svelte-check**: Type-checking for Svelte components

### Important Notes

- All routes are organized as section components imported into the main page
- The project uses Svelte 5's latest features
- microCMS is used as the headless CMS for content management
- Remote functions require server-side execution; they cannot run in pure client context
