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
  padding: 24px;        /* Mobile default */
  font-size: 14px;
}

@media screen and (width >= 768px) {
  .element {
    padding: 48px;      /* Tablet and above */
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
