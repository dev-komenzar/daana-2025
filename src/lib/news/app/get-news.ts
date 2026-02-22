import type { NewsItem, NewsItemKey } from '../domain/schema'

import { newsRepository } from '../infra/repository'

/**
 * ニュース一覧を取得
 * @param offset オフセット
 * @param limit 取得件数
 * @param fields 取得フィールド
 */
export async function getNewsAsync(offset: number, limit: number, fields: NewsItemKey[]): Promise<NewsItem[]> {
	return newsRepository.getNews(offset, limit, fields)
}
