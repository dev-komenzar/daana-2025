import type { NewsItem, NewsItemKey } from '../domain/schema'

import { newsRepository } from '../infra/repository'

/**
 * ピン留めニュースを取得
 * @param limit 取得件数（デフォルト: 5）
 * @param fields 取得フィールド
 */
export async function getPinnedNews(limit: number = 5, fields: NewsItemKey[] = ['id', 'title', 'publishedAt', 'thumbnail', 'content']): Promise<NewsItem[]> {
	return newsRepository.getPinnedNews(limit, fields)
}
