# Lessons

## 2026-04-22 (Stage 3: daana-ayq)

### PocketBase SDK: SSR では auto-cancellation を無効化する

**Why:** SSR で `Promise.all([getNews(...), getPinnedNews(...)])` のように同一コレクションへ並列リクエストすると、SDK の auto-cancellation が片方を `ClientResponseError (abort)` としてキャンセルし、`getNews` の結果が空配列になる (本番ログにスタックトレースが出る)。
**How to apply:** `new PocketBase()` 直後に `pbClient.autoCancellation(false)` を呼ぶ。または各呼び出しで `{ requestKey: null }` を渡す。SSR/バッチ処理でキャンセルが不要な場面は前者で一括無効化。

### $env/static/private: 存在しない env を参照すると build error

**Why:** SvelteKit の `$env/static/private` は build 時にリテラル置換するため、.env にも deploy 環境にも未設定の変数をインポートすると build が失敗する。任意 env は `process.env.X` か `$env/dynamic/private` を使う。
**How to apply:** `CMS_SOURCE` のように「未設定時はデフォルト値で動く」性質の env は `process.env.CMS_SOURCE` で読む (SSR のみ利用)。逆に `MICROCMS_API_KEY` / `PB_URL` のように必須のものは static/private で OK。

### PB の日時フォーマットは `YYYY-MM-DD HH:mm:ss.SSSZ` (T ではなく空白区切り)

**Why:** PocketBase の `date` フィールドは ISO8601 っぽく見えて空白区切り。そのまま client で `new Date(...)` すると Safari で失敗することがある。また valibot の `isoTimestamp()` でも NG。
**How to apply:** PB → domain NewsItem/ProjectItem へマッピング時に `value.replace(' ', 'T')` で ISO8601 化する。共通ヘルパ `normalizePbTimestamp` を `src/lib/pb/client.ts` に配置済み。

### pnpm preview も「Claude が勝手に起動しない」対象に含めるか要確認

**Why:** 今回 `pnpm preview` を verification のため一時起動→確認→kill したが、CLAUDE.md の「dev server を起動しない」ルールは `pnpm dev 等` と書かれており preview の扱いが曖昧。静的に build→preview は port 占有・副作用は限定的だが、ユーザー側の認知コストは増える。
**How to apply:** 以降は build 結果の prerender 出力を確認するだけに留め、preview 起動が必要な確認 (301 redirect 等) は user に dev/preview を起動してもらった上で Playwright MCP 経由で行う。
