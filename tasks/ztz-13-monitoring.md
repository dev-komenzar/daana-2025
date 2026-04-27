# daana-ztz.13: 切替直後の動作確認 + ログ監視 (24時間)

> 2026-04-27 13:35 にカットオーバー (v3.0.0)。24時間の安定稼働確認と障害時アラート体制を整える。

## 監視構成

- **外部監視**: healthchecks.io (無料プラン / Cron Ping 方式)
- **通知先**: Telegram (Coolify と共有の bot を再利用)
- **監視実行ホスト**: ConoHa (Coolify サーバー) で 5 分間隔の cron
- **監視対象**:
  - `https://samgha.org/api/health` (Web 自身 + PB 疎通情報)
  - `https://pb.samgha.org/api/health` (PB 直接)

### 仕組み

cron が `scripts/ops/healthcheck-monitor.sh` を 5分ごとに実行 → 各 URL を curl → 200 なら healthchecks.io に ping、失敗なら `/fail` を ping。grace period (10 分) 経過で healthchecks.io が Telegram に通知。

## Acceptance Criteria

- [ ] `/api/health` エンドポイントが 200 を返し、PB 疎通状態を含む
- [ ] Web Dockerfile に HEALTHCHECK 定義 (Coolify が unhealthy 検知できる)
- [ ] `scripts/ops/healthcheck-monitor.sh` が手動実行で正常動作
- [ ] healthchecks.io に Web/PB の 2 チェックを作成 (Schedule: 5分, Grace: 10分)
- [ ] Telegram integration で通知が届く (テスト ping で確認)
- [ ] ConoHa cron に登録 (`*/5 * * * *`)
- [ ] `docs/OPERATIONS.md` にロールバック手順 + 監視構成を記載
- [ ] 24時間 (2026-04-28 13:35 まで) アラート 0 件 / Web/PB 両方 Up 100%

## 作業項目

### 1. Web ヘルスエンドポイント

- [ ] `src/routes/api/health/+server.ts` 新規作成
  - 200 固定で `{ status, timestamp, pb }` を返す
  - PB は AbortController で 2 秒タイムアウト

### 2. Web Dockerfile に HEALTHCHECK

- [ ] `Dockerfile` runner ステージに `HEALTHCHECK` 追加 (wget で `/api/health`)

### 3. 監視スクリプト

- [ ] `scripts/ops/healthcheck-monitor.sh` 新規作成
  - HC_PING_URL_WEB / HC_PING_URL_PB 環境変数で ping URL を受ける
  - 成功時 ping、失敗時 `/fail` ping
  - 標準出力に結果ログ

### 4. healthchecks.io 設定 (ユーザー作業)

- [ ] Web 用チェック作成 (name: "samgha-org-web", schedule: 5min, grace: 10min)
- [ ] PB 用チェック作成 (name: "samgha-org-pb", schedule: 5min, grace: 10min)
- [ ] Telegram integration を 2 チェックに割り当て
- [ ] Ping URL を取得 → ConoHa の cron 環境変数に設定

### 5. ConoHa デプロイ

- [ ] スクリプトを `/opt/healthcheck/healthcheck-monitor.sh` に配置
- [ ] `/etc/cron.d/healthcheck-samgha` に cron 登録 (`*/5 * * * *`)
- [ ] テスト実行で Telegram 通知が届くことを確認

### 6. ドキュメント

- [ ] `docs/OPERATIONS.md` 新規作成
  - 監視構成図
  - アラート受信時の対応手順
  - DNS ロールバック手順 (Vercel に戻す)

### 7. 24時間後最終確認

- [ ] 2026-04-28 13:35 以降に healthchecks.io ダッシュボードで稼働率を確認
- [ ] エラーログ (Coolify) を grep で異常検出
- [ ] `bd close daana-ztz.13`

## レビュー (作業完了後に追記)

(未着手)
