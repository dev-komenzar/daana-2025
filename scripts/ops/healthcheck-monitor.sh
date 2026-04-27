#!/bin/sh
# samgha.org 外形監視 (cron 経由で 5 分間隔実行を想定)
#
# 環境変数:
#   HC_PING_URL_WEB - healthchecks.io ping URL (web)  例: https://hc-ping.com/<uuid>
#   HC_PING_URL_PB  - healthchecks.io ping URL (pb)
#   WEB_HEALTH_URL  - 既定: https://samgha.org/api/health
#   PB_HEALTH_URL   - 既定: https://pb.samgha.org/api/health
#
# 動作:
#   各 URL を curl → 200 なら ping、それ以外なら ${PING}/fail を ping。
#   一定時間 ping が来ない/fail が来ると healthchecks.io が Telegram に通知。
#
# 終了コード:
#   0: 全チェック OK
#   1: いずれか FAIL

set -u

WEB_HEALTH_URL="${WEB_HEALTH_URL:-https://samgha.org/api/health}"
PB_HEALTH_URL="${PB_HEALTH_URL:-https://pb.samgha.org/api/health}"

CURL_OPTS="-sS --max-time 10 --retry 2 --retry-delay 2"
PING_OPTS="-fsS --max-time 10 --retry 3 --retry-delay 3"

overall_rc=0

ping_hc() {
	url="$1"
	[ -z "$url" ] && return 0
	curl $PING_OPTS "$url" -o /dev/null || true
}

check() {
	name="$1"
	target="$2"
	hc_url="$3"

	body_file="$(mktemp)"
	http_code=$(curl $CURL_OPTS -o "$body_file" -w "%{http_code}" "$target" || echo "000")
	timestamp=$(date -u +%FT%TZ)

	if [ "$http_code" = "200" ]; then
		ping_hc "$hc_url"
		echo "[$timestamp] $name OK ($http_code) $target"
	else
		if [ -n "$hc_url" ]; then
			ping_hc "${hc_url%/}/fail"
		fi
		echo "[$timestamp] $name FAIL ($http_code) $target" >&2
		head -c 500 "$body_file" >&2 2>/dev/null || true
		echo >&2
		overall_rc=1
	fi

	rm -f "$body_file"
}

check "web" "$WEB_HEALTH_URL" "${HC_PING_URL_WEB:-}"
check "pb"  "$PB_HEALTH_URL"  "${HC_PING_URL_PB:-}"

exit $overall_rc
