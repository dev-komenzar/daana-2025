import type { NewsItem, NewsItemKey } from './schema'

export interface INewsRepository {
	/** ニュース一覧を取得 */
	getNews(offset: number, limit: number, fields: NewsItemKey[]): Promise<NewsItem[]>

	/** 単一ニュースを取得 */
	getNewsById(id: string): Promise<NewsItem | undefined>

	/** ピン留めニュースを取得 */
	getPinnedNews(limit: number, fields: NewsItemKey[]): Promise<NewsItem[]>

	/** ニュース総数を取得 */
	getTotalCount(): Promise<number>
}
