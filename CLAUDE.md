# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ワークフロー設計

### 1. Planモードを基本とする

- 3ステップ以上 or アーキテクチャに関わるタスクは必ずPlanモードで開始する
- 途中でうまくいかなくなったら、無理に進めずすぐに立ち止まって再計画する
- 構築だけでなく、検証ステップにもPlanモードを使う
- 曖昧さを減らすため、実装前に詳細な仕様を書く

### 2. サブエージェント戦略

- あなたはタスク進行の指揮官としてふるまい、個別の作業はおこなわないこと
- メインのコンテキストウィンドウをクリーンに保つためにサブエージェントを積極的に活用する
- リサーチ・調査・並列分析・個別のコーディングはsonnetサブエージェントに任せる
- 複雑な問題には、サブエージェントを使ってより多くの計算リソースを投入する
- 集中して実行するために、サブエージェント1つにつき1タスクを割り当てる

### 3. 自己改善ループ（auto memory 連携）

- ユーザーから修正・承認を受けたり、非自明な project decision に気付いたら auto memory に記録する
- 記録先は Claude Code の memory system (`~/.claude/projects/<project>/memory/`)。`MEMORY.md` が index、各メモリは個別ファイル + frontmatter
- 保存すべきは「将来セッションでも通用する持続的な知見」: feedback / project decision / reference / user profile
- 保存すべきでないもの: 特定バグのデバッグ手順 (コード本体と commit message に残せば十分)、コードを読めば分かる構造情報
- 同一セッション内の一時状態は TodoWrite または Plan で、永続すべきものだけ memory へ

### 4. 完了前に必ず検証する

- 動作を証明できるまで、タスクを完了とマークしない
- 必要に応じてmainブランチと自分の変更の差分を確認する
- 「スタッフエンジニアはこれを承認するか？」と自問する
- テストを実行し、ログを確認し、正しく動作することを示す

### 5. エレガントさを追求する（バランスよく）

- 重要な変更をする前に「もっとエレガントな方法はないか？」と一度立ち止まる
- ハック的な修正に感じたら「今知っていることをすべて踏まえて、エレガントな解決策を実装する」
- シンプルで明白な修正にはこのプロセスをスキップする（過剰設計しない）
- 提示する前に自分の作業に自問自答する

### 6. 自律的なバグ修正

- バグレポートを受けたら、手取り足取り教えてもらわずにそのまま修正する
- ログ・エラー・失敗しているテストを見て、自分で解決する
- ユーザーのコンテキスト切り替えをゼロにする
- 言われなくても、失敗しているCIテストを修正しに行く

---

## タスク管理

1. **まず計画を立てる**：チェック可能な項目として `tasks/todo.md` に計画を書く
2. **計画を確認する**：実装を開始する前に確認する
3. **進捗を記録する**：完了した項目を随時マークしていく
4. **変更を説明する**：各ステップで高レベルのサマリーを提供する
5. **結果をドキュメント化する**：`tasks/todo.md` にレビューセクションを追加する
6. **学びを記録する**：修正・承認や非自明な決定は auto memory (§ワークフロー設計 3) に保存する

---

## Issue Tracking (bd)

このプロジェクトでは **bd** (beads) で課題管理を行う。初回は `bd onboard` を実行すること。

```bash
bd ready              # 着手可能な作業を表示
bd show <id>          # 課題の詳細を確認
bd update <id> --status in_progress  # 作業を開始
bd close <id>         # 作業を完了
bd sync               # gitと同期
```

---

## セッション完了ワークフロー

**作業セッションを終了する際**、以下のすべてのステップを完了すること。`git commit` が成功するまで作業は完了ではない。

1. **残作業のissue化** - フォローアップが必要なものはissueを作成する
2. **品質チェック**（コード変更時） - テスト、リンター、ビルドを実行する
3. **issueステータス更新** - 完了した作業をclose、進行中のものを更新する
4. **変更をcommit** - **必須**：
   ```bash
   bd sync
   git add <files>
   git commit -m "..."
   git status  # すべての変更がcommit済みであることを確認
   ```
5. **クリーンアップ** - stashの解消、不要なファイルの削除
6. **検証** - すべての変更がcommit済みであること
7. **引き継ぎ** - 次のセッションへのコンテキストを提供する

**重要ルール：**

- `git commit` が成功するまで作業は完了ではない
- commitせずに終了しない（変更が取り残される）
- リモートへのpushはユーザーのタイミングで行う（Claude Codeからは実行しない）
- コミットメッセージは**箇条書きで5行以内**で作成する

---

## 禁止事項

- **dev server を起動しない**: `pnpm dev` 等の dev server はClaude Codeから起動しないこと。複数インスタンスでポートが重複するため、dev server はユーザーが手動で起動する。検証はユーザーが起動済みの dev server に Playwright MCP 等を通してアクセスして行う。

---

## コア原則

- **シンプル第一**：すべての変更をできる限りシンプルにする。影響するコードを最小限にする。
- **手を抜かない**：根本原因を見つける。一時的な修正は避ける。シニアエンジニアの水準を保つ。
- **影響を最小化する**：変更は必要な箇所のみにとどめる。バグを新たに引き込まない。

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

**Important**: プレビュー・開発サーバーの起動はユーザーが行います。Claudeは `pnpm dev` や `pnpm preview` を実行しないでください。

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

- **Server-Side Rendering (SSR)**: All pages are server-rendered by default
- **Load Functions**: Data fetching via `+page.server.ts` load functions

### Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── layout/      # Layout components (header)
│   │   └── ui/          # Reusable UI components (modal, cards)
│   ├── assets/          # Static assets
│   ├── news/            # News module (DDD structure)
│   │   ├── domain/      # Business logic core
│   │   ├── infra/       # External service communication
│   │   └── app/         # Use cases
│   └── projects/        # Projects module (DDD structure)
│       ├── domain/      # Business logic core
│       ├── infra/       # External service communication
│       └── app/         # Use cases
└── routes/
    ├── +page.svelte     # Homepage
    ├── +page.server.ts  # Homepage data loading
    ├── +layout.svelte   # Root layout
    ├── api/news/        # News API endpoint
    └── section-*.svelte # Page sections (mission, works, news, etc.)
```

### Data Fetching Architecture

The project uses **SvelteKit Load Functions** for server-side data fetching, organized in a **Domain-Driven Design (DDD)** structure:

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
└── index.ts          # Public API
```

#### Layer Responsibilities

1. **Domain Layer** (`domain/`): Schema definitions with valibot, repository interface, pure TypeScript types
2. **Infrastructure Layer** (`infra/`): microCMS HTTP client, repository implementation with API calls
3. **Application Layer** (`app/`): Use case functions that orchestrate domain and infra

#### Usage Patterns

```typescript
// Type definitions (client/server)
import type { NewsItem } from '$lib/news'

// Server-side only (+page.server.ts)
import { getNewsAsync, getPinnedNews } from '$lib/news/app'

// In +page.server.ts
export const load: PageServerLoad = async () => {
	const newsItems = await getNewsAsync(0, 10, ['id', 'title', 'publishedAt'])
	return { newsItems }
}
```

#### API Endpoints

For client-side dynamic data fetching (e.g., pagination), use API routes:

- `/api/news` - News list with pagination support (offset, limit parameters)

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

### Meta Tags

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

### Important Notes

- All routes are organized as section components imported into the main page
- The project uses Svelte 5's latest features
- microCMS is used as the headless CMS for content management
- Data fetching is done via `+page.server.ts` load functions (SSR)

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

### Svelte Each Block Keys

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
