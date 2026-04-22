import PocketBase from 'pocketbase'

// PB_URL は optional (本番 microCMS 期は未設定で動く必要があるため process.env で読む)。
const rawPbUrl = process.env.PB_URL?.trim() ?? ''

export const isPbConfigured = rawPbUrl !== ''

// PB_URL 未設定でも build / 型チェックが壊れないよう SDK にはデフォルト URL を渡す。
// 未稼働時のエラーは実 request 時点に遅延させる。
export const pbBaseUrl = rawPbUrl || 'http://localhost:8090'

export const pbClient = new PocketBase(pbBaseUrl)

// SSR では並列に同一コレクションを叩く (Promise.all) ため、
// SDK の auto-cancellation で片側が AbortError になるのを防ぐ。
pbClient.autoCancellation(false)

/** PB file フィールドからフル URL を生成 */
export function buildPbFileUrl(collectionIdOrName: string, recordId: string, filename: string): string {
	return `${pbBaseUrl}/api/files/${collectionIdOrName}/${recordId}/${filename}`
}

/** PB の日時表現 (`YYYY-MM-DD HH:mm:ss.SSSZ`) を ISO8601 (`T` 区切り) に正規化 */
export function normalizePbTimestamp(value: unknown): string | undefined {
	if (typeof value !== 'string' || value === '') return undefined
	return value.replace(' ', 'T')
}
