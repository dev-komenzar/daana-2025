import type { NewsItem, NewsItemKey } from './schema'

export interface INewsRepository {
	/** ニュース一覧を取得 */
	getNews(offset: number, limit: number, fields: NewsItemKey[]): Promise<NewsItem[]>

	/** 単一ニュースを取得 */
	getNewsById(id: string): Promise<NewsItem | undefined>

	/**
	 * originalId (microCMS 時代の ID) で 1 件検索。
	 * microCMS 実装では id と同一扱い、PocketBase 実装では original_id フィールドで検索。
	 */
	getNewsByOriginalId(originalId: string): Promise<NewsItem | undefined>

	/** ピン留めニュースを取得 */
	getPinnedNews(limit: number, fields: NewsItemKey[]): Promise<NewsItem[]>

	/** ニュース総数を取得 */
	getTotalCount(): Promise<number>
}
