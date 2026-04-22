import { PB_URL } from '$env/static/private'
import PocketBase from 'pocketbase'

export const isPbConfigured = Boolean(PB_URL && PB_URL.trim() !== '')

export const pbBaseUrl = PB_URL?.trim() ?? ''

export const pbClient = new PocketBase(pbBaseUrl || 'http://localhost:8090')

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
