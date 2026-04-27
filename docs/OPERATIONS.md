# 運用ガイド (samgha.org)

> 2026-04-27 v3.0.0 で Vercel + microCMS から Coolify (ConoHa) + PocketBase に移行。

## 監視構成

| 項目           | 内容                                                                        |
| -------------- | --------------------------------------------------------------------------- |
| 外部監視       | healthchecks.io (無料プラン / Cron Ping 方式)                               |
| 監視実行       | ConoHa (Coolify サーバー) の cron で 5 分間隔                               |
| 監視スクリプト | [scripts/ops/healthcheck-monitor.sh](../scripts/ops/healthcheck-monitor.sh) |
| 通知先         | Telegram (Coolify と共有 bot)                                               |
| 監視対象       | `https://samgha.org/api/health` / `https://pb.samgha.org/api/health`        |

### healthchecks.io チェック

| チェック名     | URL                                | Schedule | Grace  |
| -------------- | ---------------------------------- | -------- | ------ |
| samgha-org-web | `https://samgha.org/api/health`    | 5 min    | 10 min |
| samgha-org-pb  | `https://pb.samgha.org/api/health` | 5 min    | 10 min |

各チェックの ping URL は ConoHa の cron 環境変数 `HC_PING_URL_WEB` / `HC_PING_URL_PB` に設定する。

### Coolify Docker HEALTHCHECK

- Web (SvelteKit): `wget /api/health` を 30 秒間隔 ([Dockerfile](../Dockerfile))
- PocketBase: `wget /api/health` を 30 秒間隔 ([pocketbase/Dockerfile](../pocketbase/Dockerfile))

Coolify が unhealthy を検知するとコンテナを再起動する。

## アラート受信時の対応

### 1. 状況確認

```bash
# 手動で同じ URL を叩く
curl -i https://samgha.org/api/health
curl -i https://pb.samgha.org/api/health

# ConoHa にログインして Coolify ダッシュボードを開く
# → daana-web / daana-pocketbase の status と最新ログを確認
```

### 2. よくある原因と対応

| 症状                   | 原因の可能性                     | 対応                                          |
| ---------------------- | -------------------------------- | --------------------------------------------- |
| Web 503/タイムアウト   | デプロイ失敗 / OOM               | Coolify でロールバック → 直前のイメージに戻す |
| PB 接続不可            | コンテナ落ち / volume permission | `docker logs daana-pocketbase` を確認、再起動 |
| 両方ダウン             | サーバー障害 / 証明書失効        | ConoHa コンソールで VPS 状態確認              |
| `pb: unreachable` のみ | Web→PB の内部ネットワーク不通    | Coolify ネットワーク再作成                    |

### 3. DNS ロールバック (最終手段)

24時間以内に致命的な問題が継続する場合、Vercel に戻す。

1. Vercel プロジェクト ([daana-y16.1](../README.md) でまだ稼働中) が build 済みであることを確認
2. DNS プロバイダで A/AAAA レコードを Vercel の IP に戻す (旧値は git 履歴 / DNS プロバイダの履歴を参照)
3. TTL は短縮済み (daana-ztz.11 で 60s に変更済み)
4. 切替後 5-15 分で反映、healthchecks.io ダッシュボードで OK に戻ることを確認
5. ロールバック理由を bd issue に記録

## 監視スクリプトのデプロイ手順 (ConoHa)

```bash
# 1. スクリプト配置
sudo install -o root -g root -m 0755 scripts/ops/healthcheck-monitor.sh \
    /opt/healthcheck/healthcheck-monitor.sh

# 2. 環境変数ファイル
sudo tee /etc/default/healthcheck-samgha > /dev/null <<'EOF'
HC_PING_URL_WEB=https://hc-ping.com/<web-uuid>
HC_PING_URL_PB=https://hc-ping.com/<pb-uuid>
EOF
sudo chmod 0640 /etc/default/healthcheck-samgha

# 3. cron 登録
sudo tee /etc/cron.d/healthcheck-samgha > /dev/null <<'EOF'
*/5 * * * * root . /etc/default/healthcheck-samgha && /opt/healthcheck/healthcheck-monitor.sh >> /var/log/healthcheck-samgha.log 2>&1
EOF

# 4. ログローテーション
sudo tee /etc/logrotate.d/healthcheck-samgha > /dev/null <<'EOF'
/var/log/healthcheck-samgha.log {
    weekly
    rotate 4
    compress
    missingok
    notifempty
}
EOF
```

## 環境変数 (Coolify)

| Service          | 変数            | 用途                                               |
| ---------------- | --------------- | -------------------------------------------------- |
| daana-web        | `PB_URL`        | サーバー→PB の内部URL (Coolify ネットワーク alias) |
| daana-web        | `PB_PUBLIC_URL` | クライアントに返すファイルURL用                    |
| daana-pocketbase | (volume mount)  | `daana-pb-data` → `/pb/pb_data`                    |

詳細は [docker-compose.yml](../docker-compose.yml) と Coolify UI を参照。
