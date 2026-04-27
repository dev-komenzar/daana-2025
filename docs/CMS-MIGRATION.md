# CMS 運用手順書 (PocketBase / Coolify)

> 対象: samgha.org の Web / CMS を引き継ぐエディタおよび運用担当者
> 前提: 2026-04-27 (v3.0.0) で microCMS から PocketBase に移行済み。samgha.org は ConoHa 上の Coolify でホスト。

本書は **新メンバーが上から手順をなぞって実行できる** ことを目的とした運用手順書である。アラート対応や監視構成は [OPERATIONS.md](./OPERATIONS.md)、ブランチと CI のルールは [BRANCHING.md](./BRANCHING.md) を参照すること。

## 目次

1. [前提環境](#前提環境)
2. [Superuser 管理](#superuser-管理)
3. [Editor (CMS 編集者) の追加](#editor-cms-編集者-の追加)
4. [バックアップ](#バックアップ)
5. [301 リダイレクト維持期間](#301-リダイレクト維持期間)
6. [緊急時ロールバック](#緊急時ロールバック)

## 前提環境

| 項目           | 値                                                                                     |
| -------------- | -------------------------------------------------------------------------------------- |
| 公開ドメイン   | `https://samgha.org` (Web), `https://pb.samgha.org` (PocketBase API)                   |
| PB Admin UI    | `https://pb.samgha.org/_/`                                                             |
| ホスティング   | ConoHa VPS + Coolify (`160.251.179.252` / IPv6: `2400:8500:2002:3166:160:251:179:252`) |
| PocketBase     | v0.37 系 ([pocketbase/Dockerfile](../pocketbase/Dockerfile) の `PB_VERSION`)           |
| データ永続     | Docker volume `daana-pb-data` → `/pb/pb_data`                                          |
| ログイン (CMS) | `https://samgha.org/cms/login` (role=editor 必須)                                      |

> ConoHa への SSH 接続情報・Coolify 管理者ログインは **1Password の `samgha.org / ConoHa` Vault** にある。新メンバーはまず管理者にアクセス権を依頼すること。

## Superuser 管理

PocketBase の **Superuser** はスキーマ変更・コレクションルール変更・他ユーザの role 変更ができる管理者アカウント。`/_/` admin UI へのログインに必須。

### 1. 初期 Superuser

初回起動時に Coolify の環境変数で自動作成する。

| 変数                | 用途                                      |
| ------------------- | ----------------------------------------- |
| `PB_ADMIN_EMAIL`    | 初期 superuser のメールアドレス           |
| `PB_ADMIN_PASSWORD` | 初期 superuser のパスワード (10 文字以上) |

設定済みの値は Coolify UI → `daana-pocketbase` サービス → Environment Variables で確認できる (値はマスクされているので、変更が必要なら下記「ローテーション」手順で行う)。

### 2. Superuser を追加する

1. `https://pb.samgha.org/_/` に既存 superuser でログイン
2. 右上アバター → **Manage superusers** → **+ New superuser**
3. メールアドレスとパスワードを入力して保存
4. 追加した superuser でログインできることを別ブラウザ等で確認

### 3. パスワードリセット

UI からはメール送信できないため、**ConoHa 上で CLI を直接叩く**。

```bash
# ConoHa にログイン後、daana-pocketbase コンテナで実行
docker exec -it daana-pocketbase /pb/pocketbase superuser update <email> <new-password>
```

### 4. 退職者対応 (ローテーション)

退職者・委託契約終了時は **必ず即日**:

1. 該当 superuser を `/_/` の Manage superusers から削除
2. 退職者がアクセスしていた可能性がある場合は、自分のパスワードも変更
3. Coolify 環境変数の `PB_ADMIN_PASSWORD` を新しい値に更新 (旧 `PB_ADMIN_EMAIL` の superuser をローテーションしたい場合)
4. Telegram bot / 1Password など共有シークレットも棚卸し
5. 対応した内容を beads issue (`bd create --type=task --priority=1`) に記録

> 共有 superuser 1 つを使い回さないこと。担当者ごとに個人アカウントを発行し、退職時に確実に削除できるようにする。

## Editor (CMS 編集者) の追加

`role=editor` を持つ通常ユーザーが `/cms` にログインしてニュース・プロジェクト・メディアを編集できる。

### 仕組み

- `users` コレクションに `role` フィールド (`editor` | `viewer`) がある ([1776988800_add_users_role.js](../pocketbase/pb_migrations/1776988800_add_users_role.js))
- コレクションルールで `@request.auth.role = "editor"` のときだけ news/projects/media の作成・更新・削除が許可される ([1776989200_set_collection_rules.js](../pocketbase/pb_migrations/1776989200_set_collection_rules.js))
- editor 自身が自分の `role` を昇格できないように [users_guard.pb.js](../pocketbase/pb_hooks/users_guard.pb.js) で hook gate がかかる。**role の変更は superuser からのみ可能**

### 追加手順

1. `https://pb.samgha.org/_/` に **superuser** でログイン
2. 左ペイン → `users` コレクション → **+ New record**
3. 以下を入力して **Create**
   - `email`: 編集者の業務メールアドレス
   - `password` / `passwordConfirm`: 仮パスワード (10 文字以上)
   - `name`: 表示名 (任意)
   - `role`: **`editor`** を選択
   - `verified`: チェック (任意。メール認証フローを使わないなら ON)
4. 仮パスワードを **本人の安全なチャネル** (1Password 共有 / 暗号化メッセンジャー) で渡し、初回ログイン後に変更してもらう
5. 本人が `https://samgha.org/cms/login` でログインできることを確認

### 動作確認チェックリスト

- [ ] `/cms/login` で email + password 認証が通る
- [ ] `/cms/news` 一覧が表示される
- [ ] `/cms/news/new` で記事作成・保存できる
- [ ] `/cms/projects` で既存記事を編集・保存できる
- [ ] `/cms/media` で画像をアップロードできる
- [ ] PB admin UI (`/_/`) には **アクセスできない** こと (editor は superuser ではない)

### Editor を無効化する

退職・契約終了時は、PB admin UI で該当ユーザーを:

- **削除する**: 履歴も含めてアカウント自体を消す (推奨)
- **role を空にする**: `role` を未設定にすると CMS にログインしてもコレクション操作が拒否される (一時停止用途)

## バックアップ

### バックアップ対象

| 対象                          | 場所                                                      | バックアップ方法                     |
| ----------------------------- | --------------------------------------------------------- | ------------------------------------ |
| SQLite DB + uploads           | volume `daana-pb-data` (= `/pb/pb_data`)                  | PB Backups 機能 (zip)                |
| マイグレーション定義          | [pocketbase/pb_migrations/](../pocketbase/pb_migrations/) | git で管理済み (バックアップ不要)    |
| カスタム hook                 | [pocketbase/pb_hooks/](../pocketbase/pb_hooks/)           | git で管理済み (バックアップ不要)    |
| Coolify 設定 / docker-compose | ConoHa の Coolify DB                                      | Coolify 自身の backup 機能で別途取得 |

### 定期バックアップ (PocketBase Backups 機能)

PocketBase は admin UI から **Settings → Backups** で zip 形式の完全バックアップを取得できる。スケジュール設定もこの画面から行う。

#### 推奨スケジュール

- **頻度**: 毎日 03:00 JST (アクセスが少ない時間帯)
- **保持件数**: 14 (最大 2 週間)

設定手順:

1. `/_/` → **Settings** → **Backups**
2. **Auto backups** を有効化
3. Cron 式: `0 18 * * *` (UTC で記述。JST 03:00 → UTC 18:00)
4. Max keep: `14`
5. (任意) **S3 storage** を設定して外部に転送する場合は、Coolify の env で AWS credential を渡してから `/_/` の S3 設定を入力する

#### 手動バックアップ (リリース前など)

```bash
# Coolify ホスト上で
curl -sf -X POST "https://pb.samgha.org/api/backups" \
  -H "Authorization: $PB_SUPERUSER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"pre-release-v3.x.x.zip"}'
```

`PB_SUPERUSER_TOKEN` は `/_/` で superuser ログイン後、ブラウザの開発者ツールから `pb_admin_auth` を取り出すか、SDK で `pb.admins.authWithPassword(...)` して取得する。

### リストア手順

1. **作業前に** 現状のスナップショットを 1 件追加で取得 (二重バックアップ)
2. メンテナンスモードに入る (Coolify でフロントエンドを一時停止するか、`samgha.org` を 503 maintenance ページに切替)
3. PB admin UI → Settings → Backups → 戻したい backup の **... → Restore**
4. 復元完了後、PocketBase コンテナが自動再起動する
5. `https://pb.samgha.org/api/health` が 200 を返すことを確認
6. アプリ側 (`https://samgha.org/`) でデータが期待通り戻っていることを確認
7. メンテナンスモードを解除

> **注意**: Restore は破壊的操作。`pb_data` 全体を上書きするので、復元後の差分データは失われる。直前にもう 1 度バックアップを取ってから実行すること。

### Volume レベルのバックアップ (任意・追加保険)

PocketBase が起動できないほど壊れた場合の保険として、ConoHa の VPS スナップショットを月 1 で取得しておくと復旧速度が上がる。

```bash
# ConoHa コンソールで daana-vps の「サーバー」→「スナップショット作成」
# 名称: yyyymmdd-monthly
```

## 301 リダイレクト維持期間

microCMS から PocketBase へ移行した際、ニュースの URL が `/news/<microcms-id>` から `/news/<pb-id>` に変わった。SEO と既存リンク維持のため、旧 URL → 新 URL の **301 リダイレクト** を実装している。

### 実装位置

- [src/routes/news/[slug]/+page.server.ts:14-18](../src/routes/news/%5Bslug%5D/+page.server.ts#L14-L18) — slug が新 ID で見つからなければ `getNewsByOriginalId` で旧 microCMS ID を逆引きして 301 redirect
- [src/lib/news/infra/pb-repository.ts](../src/lib/news/infra/pb-repository.ts) — `original_id` カラムでフィルタする実装
- [pocketbase/pb_migrations/1776989000_create_news.js](../pocketbase/pb_migrations/1776989000_create_news.js) — `original_id` カラム定義 (PB 側のスキーマ)

projects も同じパターンで `original_id` を持つが、現時点で公開 URL を直接使う page route がないため redirect は news のみ。

### 維持期限

| 項目             | 日付                        |
| ---------------- | --------------------------- |
| DNS 切替日       | 2026-04-27 (v3.0.0)         |
| 維持期間         | **1 年**                    |
| 削除可能となる日 | **2027-04-27 以降**         |
| 担当 issue       | [daana-y16.7](../README.md) |

> 1 年は Google Search Console での再インデックス完了と外部リンク更新を見込んだ目安。検索流入のクエリで旧 ID 経由が月数件以下になっていることを確認してから削除する (Search Console → 「カバレッジ」→「リダイレクト」を参照)。

### 削除手順 (2027-04-27 以降)

1. Google Search Console で旧 ID への流入が「ほぼゼロ」であることを確認
2. アプリ側の redirect ロジックを削除:
   - [src/routes/news/[slug]/+page.server.ts](../src/routes/news/%5Bslug%5D/+page.server.ts) の `getNewsByOriginalId` フォールバックを削除
   - `INewsRepository.getNewsByOriginalId` メソッド本体および `pb-repository.ts` の実装を削除
3. PB スキーマの `original_id` カラムは **温存** (履歴情報として残す。削除すると微妙な復旧が困難になる)。どうしても削除したい場合のみ migration を追加
4. `pnpm check` / `pnpm lint` / `pnpm build` を通して PR 化
5. y16.7 を close、関連 ロギング (Plausible / Vercel Logs) で 404 が増えていないか 1 週間モニタする

## 緊急時ロールバック

層別に 3 段階のロールバック手段を持っている。**症状に合わせて最も小さい影響範囲のものから試す**。

### 1. アプリのロールバック (Coolify)

**症状例**: 直近のデプロイ後に画面が壊れた / `/api/health` が 5xx / Coolify が unhealthy 検知してコンテナをループ再起動

```text
Coolify UI → daana-web → Deployments
  → 直前の成功した deployment の ⋯ → Redeploy
```

3〜5 分でロールバック完了。git の `main` HEAD は変えないので、PR は引き続きリバート PR として用意して通常フローでマージする。

### 2. データのロールバック (PocketBase backup)

**症状例**: editor が誤って大量削除した / マイグレーション失敗で DB スキーマが壊れた / 外部攻撃でデータ汚染

[バックアップ §リストア手順](#リストア手順) を実行。直近 14 日間のうち、最も新しい正常なバックアップを選ぶ。

> **マイグレーション失敗の場合**: PB は migrate 適用前に自動 backup を取る (`pb_data/backups/` 配下に `auto-yyyymmdd-...zip`)。これを使うと migrate 直前に戻せる。

### 3. DNS のロールバック (Vercel への復帰)

**症状例**: ConoHa VPS 自体がダウン / 1〜2 を試しても復旧しない / Coolify 全体が起動できない

詳細は [OPERATIONS.md §3. DNS ロールバック (最終手段)](./OPERATIONS.md#3-dns-ロールバック-最終手段) を参照。要点:

1. Vercel プロジェクト ([daana-y16.1](../README.md) の解約までは稼働中) が build 済みであることを確認
2. DNS の `samgha.org` の A/AAAA レコードを Vercel の値に戻す
3. TTL は移行前から 60s に短縮済み (daana-ztz.11)。5〜15 分で反映
4. healthchecks.io が OK に戻ることを確認
5. ロールバック理由を beads に記録 (`bd create --type=bug --priority=0`)

> Vercel 側は **microCMS** を読みに行く。移行後に PocketBase 側で行われた編集は Vercel に反映されない点に注意 (差分は手動で再投入する必要がある)。

### ロールバック判断のフロー

```text
症状発生
  ├─ 直近のデプロイ起因か？ ── Yes ─→ 1. Coolify Redeploy
  │                          └─ No
  ├─ DB データ起因か？     ── Yes ─→ 2. PB backup restore
  │                          └─ No
  └─ サーバー全体ダウン？  ── Yes ─→ 3. DNS ロールバック
                              └─ No → OPERATIONS.md のアラート対応に戻り原因調査
```

判断に迷う場合は **DNS ロールバックを先に行ってから** 原因調査する (samgha.org の停止時間を最小化するため)。

## 参考

- [OPERATIONS.md](./OPERATIONS.md) — 監視構成・アラート受信時の手順
- [BRANCHING.md](./BRANCHING.md) — ブランチ運用と CI gate
- [README.md](../README.md) — プロジェクト全体像
- [CLAUDE.md](../CLAUDE.md) — エージェント運用ルール
- 関連 epic: [daana-cn7](../README.md) (ブランチ & CI) / [daana-y16](../README.md) (Stage 6: クリーンアップ)
- 関連 task: daana-cn7.4 (本 doc) / daana-y16.7 (301 削除期限)
