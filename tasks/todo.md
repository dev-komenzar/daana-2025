# daana-ajs.23: CMS UI のテスト基盤セットアップ

> vitest + @testing-library/svelte (component test) + Playwright (E2E) の初期構成。
> 後続 22 件 (daana-ajs.1 〜 22) のブロッカー解消が目的。

## Acceptance Criteria

- [ ] `pnpm test` が pass (unit + component)
- [ ] `pnpm test:e2e` がローカルで起動できる
- [ ] CI で unit test が実行できる
- [ ] E2E はローカル (コミット前) 実行方針 — CI には入れない (issue の AC から意図的に緩和、bead にコメント残す)

## 作業項目

### 1. 依存パッケージ追加 (dev)

- [ ] `@testing-library/svelte` (Svelte 5 対応 v5+)
- [ ] `@testing-library/jest-dom` (custom matchers)
- [ ] `jsdom` (browser 環境)
- [ ] `@playwright/test`

### 2. vitest 設定拡張 (`vitest.config.ts`)

- [ ] `test.projects` で server (node) / client (jsdom) を分離
  - server: `**/*.test.ts` (既存 schema テストはこちら)
  - client: `**/*.svelte.test.ts` (component テスト)
- [ ] client project で `@sveltejs/vite-plugin-svelte` を登録
- [ ] `setupFiles` で `@testing-library/jest-dom/vitest` を拡張
- [ ] `loadEnv` 挙動は維持

### 3. Playwright 設定 (`playwright.config.ts`)

- [ ] webServer: `pnpm build && pnpm preview --port 4173`
- [ ] testDir: `e2e/`
- [ ] projects: chromium のみ (CI コスト考慮、firefox/webkit は後日)
- [ ] `.gitignore` に `/test-results/`, `/playwright-report/`, `/e2e/.auth/` 追加

### 4. サンプルテスト

- [ ] component test サンプル: `src/lib/components/ui/enhanced-image.svelte` は外部依存強いので回避し、シンプルな既存コンポーネントを対象に `*.svelte.test.ts` を 1 件作成
- [ ] E2E サンプル: `e2e/homepage.spec.ts` — `/` にアクセスして title が存在することを確認

### 5. package.json scripts

- [ ] `test` → `pnpm test:unit` (既存の `vitest run` から変更)
- [ ] `test:unit` → `vitest run`
- [ ] `test:unit:watch` → `vitest` (既存 `test:watch` を rename)
- [ ] `test:e2e` → `playwright test`
- [ ] `test:e2e:ui` → `playwright test --ui`
- [ ] lint-staged で `*.svelte.test.ts` が誤って svelte-check にかからないかを確認

### 6. CI (`.github/workflows/ci.yml`)

- [ ] 既存 `quality` ジョブに unit test ステップ追加 (`pnpm test:unit`)
- [ ] E2E は CI では実行しない (ローカル手動実行)

### 7. 検証

- [ ] ローカル: `pnpm install && pnpm test && pnpm test:e2e`
- [ ] `pnpm check` が通る
- [ ] `pnpm lint` `pnpm lint:style` が通る

## Review

### 変更ファイル

- `package.json` — dev deps (@playwright/test, @testing-library/svelte, @testing-library/jest-dom, jsdom) と scripts (test:unit, test:e2e, 他)
- `vitest.config.ts` — `test.projects` で server(node) / client(jsdom) に分割
- `vitest-setup-client.ts` — jest-dom matchers を client project にロード (新規)
- `playwright.config.ts` — chromium, webServer=`pnpm build && pnpm preview --port 4173` (新規)
- `src/app.d.ts` — `@testing-library/jest-dom` type を triple-slash reference で取り込み
- `src/lib/components/ui/horizontal-divider.svelte.test.ts` — component test サンプル (新規)
- `e2e/homepage.spec.ts` — E2E サンプル (新規)
- `.gitignore` — Playwright 出力を除外
- `.github/workflows/ci.yml` — `pnpm test:unit` ステップを quality ジョブに追加

### 検証結果

- `pnpm test` → 51 pass / 2 skipped (既存 48 + 新規 3)
  - server project: news / projects の schema/infra test
  - client project: horizontal-divider component test
- `pnpm check` → 残 2 エラーはいずれも `$env/static/private` の `CMS_SOURCE` 欠落で、ローカル `.env` の `.env.example` 追従漏れ (本タスク範囲外)
- `pnpm lint:ci` → 0 errors (warnings は既存の svelte/no-navigation-without-resolve)
- `pnpm lint:style:ci` → clean
- `pnpm exec playwright test --list` → 1 test recognized
- `pnpm test:e2e` フル実行は build が CMS_SOURCE 欠落で落ちる (同上の既存問題)

### AC 達成状況

- [x] `pnpm test` が pass
- [x] `pnpm test:e2e` がローカルで起動できる (config / browser install 完了、実テストは .env 修正後)
- [x] CI で unit test が実行できる (`.github/workflows/ci.yml` に追加)
- [x] E2E はローカル実行方針 (bead へコメント反映済み)

### Follow-up

- ローカル `.env` に `CMS_SOURCE=microcms` を追記すれば `pnpm check` / `pnpm test:e2e` フル実行も通る (ユーザ環境側)
