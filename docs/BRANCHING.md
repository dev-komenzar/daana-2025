# ブランチ戦略

このリポジトリの Git 運用ルールをまとめる。CMS 移行 (microCMS → PocketBase, beads: daana-pb3〜daana-y16) の期間中も本ドキュメントに従うこと。

## TL;DR

- `main` をいつでもデプロイ可能な唯一の統合ブランチとする（GitHub Flow）
- 作業は `feature/<slug>` を切って PR で `main` にマージする
- 並行運用中の CMS 切替は **Feature Flag `CMS_SOURCE`** で行い、ブランチでは分けない
- タグは `v<MAJOR>.<MINOR>.<PATCH>` の SemVer。PocketBase 本番切替で `v3.0.0` にメジャーアップ

## ブランチ一覧

| ブランチ         | 役割                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------- |
| `main`           | 常に production-ready。Vercel 本番 → Coolify 本番 (daana-ztz.12 以降) に追従する唯一の長期ブランチ。    |
| `preview`        | Vercel Preview / Coolify ステージング検証用。必要時に `main` から fast-forward 更新。直接コミット禁止。 |
| `feature/<slug>` | 通常の作業ブランチ。PR 経由でのみ `main` にマージ。マージ後は削除。                                     |
| `release/*`      | 原則使わない。緊急の hotfix は `fix/<slug>` ブランチ経由で `main` に入れ、直接タグを打つ。              |

> `develop` ブランチは作らない。長期分岐は並行運用のリスクを増やすため、代わりに Feature Flag で切替する。

## ブランチ命名規約

```
<type>/<bd-id?>-<slug>
```

- **type**: `feature`, `fix`, `chore`, `refactor`, `docs`, `test`, `perf`, `ci`
- **bd-id** (任意だが推奨): beads の issue ID (`daana-cn7.1` など)。ドットは `-` に置換
- **slug**: 小文字ケバブケース。20 文字以内目安

例:

```
feature/daana-cn7-1-branching-doc
feature/daana-ajs-7-tiptap-deps
fix/daana-ayq-5-news-301-redirect
chore/daana-pb3-1-pocketbase-scaffold
docs/update-readme
```

PR を出したら beads 側で `bd update <id> --status in_progress` を併記する。

## コミット規約

[Conventional Commits](https://www.conventionalcommits.org/ja/v1.0.0/) を採用する。既存履歴 (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`) と揃えること。

```
<type>(<scope?>): <summary>

<body?>

<footer?>
```

- **type**: `feat`, `fix`, `refactor`, `docs`, `chore`, `perf`, `test`, `ci`, `build`, `style`
- **scope** (任意): `news`, `projects`, `cms`, `pb`, `beads` など。影響モジュール名を入れると履歴が読みやすくなる
- **summary**: 50 文字以内、命令形。日本語/英語どちらでも可（このプロジェクトは日本語主）
- **body**: 何を/なぜ。必要ないなら省略
- **footer**: `BREAKING CHANGE:` やチケット参照 (`Refs: daana-cn7.1`)

### 例

```
feat(cms): TipTap エディタの画像挿入モーダルを実装

Refs: daana-ajs.19
```

```
fix(news): ピン留めニュースの日付表示をYYYY.MM.DD形式に変更
```

### Breaking changes

`CMS_SOURCE` のデフォルト値を `microcms` → `pocketbase` に切替えるときなど、公開 API/運用に影響する変更は footer に

```
BREAKING CHANGE: CMS_SOURCE default is now `pocketbase`.
```

を必ず入れること。これを起点に `MAJOR` をインクリメントする。

## PR フロー

1. `main` の最新を pull してから `feature/<slug>` を作成
2. ローカルで実装し、`pnpm check` / `pnpm lint` / `pnpm lint:style` を通す（pre-commit hook で走る）
3. `git push -u origin feature/<slug>`
4. GitHub で PR 作成。タイトルは Conventional Commits に準じる
5. CI gate (`.github/workflows/ci.yml`):
   - `pnpm check` (svelte-check)
   - `pnpm lint:ci` (eslint, no-fix — CI 専用)
   - `pnpm lint:style:ci` (stylelint, no-fix — CI 専用)
   - ローカルの `pnpm lint` / `pnpm lint:style` は `--fix` 付きで開発用途、CI では `--fix` 無しの `:ci` バリアントを実行して auto-fix によるエラー隠蔽を防ぐ
   - GitHub の branch protection で `Quality (check / lint / lint:style)` を required status check に設定すること (admin 作業)
6. レビュー 1 名以上の approve 後、**Squash merge** で `main` に取り込む
   - squash メッセージはブランチのコミットをまとめた Conventional Commits 形式にする
7. マージ後、ブランチは自動削除。対応する `bd close <id>` を実行

### 例外: hotfix

本番障害時は `fix/<slug>` を `main` から切り、最短で PR → squash merge → `vX.Y.(Z+1)` タグ打ち。`preview` は事後に fast-forward 追随する。

## Feature Flag による並行運用 (CMS_SOURCE)

Stage 3 (daana-ayq) で `CMS_SOURCE` env を導入し、Stage 5 (daana-ztz) までの期間、`main` 1 本で **microCMS / PocketBase の両リポジトリ実装を同居** させる。

```
CMS_SOURCE=microcms    # Vercel 本番 (デフォルト)
CMS_SOURCE=pocketbase  # Coolify ステージング〜本番切替後
```

原則:

- 両 Repository 実装 (`src/lib/news/infra/`, `src/lib/projects/infra/`) を同じ `main` に保持する
- ブランチでは分けない（長期分岐は衝突の温床になる）
- 新機能追加時は **両実装に対応するか、どちらかに限定**（限定時は README/PR にその旨を明記）
- Flag 切替テストは CI で両値を matrix 実行するのが望ましい（daana-cn7.2 の検討事項）
- Stage 6 (daana-y16) で microCMS 実装と flag 自体を削除

## タグ戦略 (SemVer)

`vMAJOR.MINOR.PATCH` (SemVer)。

| バンプ基準 | トリガー例                                                                              |
| ---------- | --------------------------------------------------------------------------------------- |
| MAJOR      | CMS 本番切替 (v3.0.0 @ daana-ztz.12)、公開 URL 構造の破壊的変更、Node/pnpm メジャー更新 |
| MINOR      | Stage 毎の主要機能完了 (例: `/cms` 公開、TipTap 統合、移行スクリプト完成)               |
| PATCH      | バグ修正、文言修正、依存更新                                                            |

移行マイルストン例:

- `v2.x.y`: microCMS 本番運用継続中
- `v2.99.0` (任意): PocketBase 移行の直前スナップショット（ロールバック基点）
- `v3.0.0`: DNS 切替 (daana-ztz.12) 完了。`CMS_SOURCE` デフォルトを `pocketbase` に変更
- `v3.x.y`: PocketBase 運用。Stage 6 完了で microCMS 実装削除 → `v3.1.0` など

タグは `main` の squash merge commit に対して打つ。annotated tag (`git tag -a`) を推奨。

```
git tag -a v3.0.0 -m "feat: DNS を Coolify に切替。CMS_SOURCE デフォルトを pocketbase に"
git push origin v3.0.0
```

## デプロイとブランチ

| 時期              | 本番    | ステージング         | 備考                                                       |
| ----------------- | ------- | -------------------- | ---------------------------------------------------------- |
| 現状 (〜v2.x)     | Vercel  | Vercel Preview       | `main` push で Vercel 本番、PR で Preview URL              |
| Stage 5 移行中    | Vercel  | Coolify ステージング | Coolify は `preview` ブランチを watch、もしくは手動 deploy |
| Stage 5 DNS切替後 | Coolify | Coolify (別 domain)  | Vercel は 3〜7 日フォールバック後に停止 (daana-y16.1)      |
| Stage 6 以降      | Coolify | Coolify              | microCMS/Vercel 依存完全撤廃                               |

## 禁止事項 / 注意

- `main` への直接 push は禁止（GitHub 側で protection 設定推奨）
- `--force`/`--force-with-lease` での `main` 書き換え禁止
- コミット時に `--no-verify` で hook を無効化しない（CLAUDE.md のセッション完了ワークフロー参照）
- secrets (`.env`, API key) をコミットしない
- dev server (`pnpm dev`) の起動は開発者が手動で行う。CI やエージェント経由で起動しない

## 参考

- [CLAUDE.md](../CLAUDE.md) - エージェント運用とセッション完了ワークフロー
- beads: `bd ready` で着手可能タスクを確認
- 関連 epic: daana-cn7 (本 doc), daana-cn7.2 (CI gate), daana-cn7.4 (運用手順書)
