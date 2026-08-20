# CODING.md

This file contains coding conventions for this repository.
See [AGENTS.md](./AGENTS.md) for project overview and workflow guidance.

## Font Configuration

- **English**: Futura
- **Japanese**: Noto Sans JP (downloaded from Google Fonts, stored in `static/fonts/`)
- Font weights are specified by font-family name (e.g., 'Noto Sans JP Light') rather than using variable fonts

## Code Quality Tools

- **Prettier**: Code formatter (tabs, no semicolons, single quotes)
- **ESLint**: Extended with perfectionist, svelte, and unicorn plugins
- **Stylelint**: Uses standard config with recess-order and HTML support
- **Husky + lint-staged**: Pre-commit hooks run Prettier and linting automatically
- **svelte-check**: Type-checking for Svelte components

## Image Handling

- **Static assets**: Use `EnhancedImage` component (`src/lib/components/ui/enhanced-image.svelte`) instead of raw `<img>` tags
  - Automatically converts images to AVIF/WebP formats
  - Generates multiple sizes for responsive images
  - Prevents layout shift by auto-setting width/height
  - Images must be imported from `$lib/assets/`
- **External URLs** (e.g., microCMS): Use standard `<img>` tags with explicit `width` and `height` attributes

## Meta Tags

Use **svelte-meta-tags** for SEO meta tags instead of `<svelte:head>`. Define meta tags in `+layout.svelte` files:

```svelte
<script lang="ts">
	import { SITE_FULL_URL } from '$lib/constants'
	import { MetaTags } from 'svelte-meta-tags'

	let { children } = $props()
</script>

<MetaTags
	title="ページタイトル"
	titleTemplate="%s | 日本仏教徒協会"
	description="ページの説明"
	canonical={`${SITE_FULL_URL}/path`}
/>

{@render children?.()}
```

**Important**: Do NOT use `<svelte:head>` for meta tags. Always use `svelte-meta-tags` in `+layout.svelte`.

## CSS Architecture - Mobile First

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

## Space Handling

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

## Scroll Animations

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

## Svelte Each Block Keys

Always provide a key expression for `{#each}` blocks to help Svelte efficiently track and update list items:

```svelte
<!-- Good: with key -->
{#each items as item (item.id)}
	<div>{item.name}</div>
{/each}

<!-- Good: with key and index -->
{#each items as item, index (item.id)}
	<div>{index}: {item.name}</div>
{/each}

<!-- Bad: no key (causes linter warning) -->
{#each items as item}
	<div>{item.name}</div>
{/each}
```

**Key selection**:

- Use a unique identifier like `id` when available
- The key must be unique within the list
- Avoid using array index as the key if items can be reordered or filtered
