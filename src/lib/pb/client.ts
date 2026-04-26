import PocketBase from 'pocketbase'

// 実行時環境変数で読み込む（ビルド時に焼き込まない）
// PB_URL: サーバー→PB の内部通信URL（Coolify ネットワークエイリアス等）
// PB_PUBLIC_URL: ブラウザに返すファイルURL用の公開URL（未設定時は PB_URL を使用）
const pbApiUrl = process.env.PB_URL?.trim()
const pbPublicUrl = process.env.PB_PUBLIC_URL?.trim() || pbApiUrl

export const isPbConfigured = Boolean(pbApiUrl)

export const pbBaseUrl = pbPublicUrl ?? ''

export const pbClient = new PocketBase(pbApiUrl)

// SSR では並列に同一コレクションを叩く (Promise.all) ため、
// SDK の auto-cancellation で片側が AbortError になるのを防ぐ。
pbClient.autoCancellation(false)

/** PB file フィールドからフル URL を生成 */
export function buildPbFileUrl(collectionIdOrName: string, recordId: string, filename: string): string {
	return `${pbPublicUrl}/api/files/${collectionIdOrName}/${recordId}/${filename}`
}

/** PB の日時表現 (`YYYY-MM-DD HH:mm:ss.SSSZ`) を ISO8601 (`T` 区切り) に正規化 */
export function normalizePbTimestamp(value: unknown): string | undefined {
	if (typeof value !== 'string' || value === '') return undefined
	return value.replace(' ', 'T')
}
