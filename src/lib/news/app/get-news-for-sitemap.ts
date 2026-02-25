import type { NewsItemKey } from '../domain/schema'

import { newsRepository } from '../infra/repository'

export interface SitemapNewsItem {
	id: string
	publishedAt?: string
}

/**
 * サイトマップ用のニュース一覧を取得
 * @returns 全ニュースのID と公開日時
 */
export async function getNewsForSitemap(): Promise<SitemapNewsItem[]> {
	const fields: NewsItemKey[] = ['id', 'publishedAt']
	const news = await newsRepository.getNews(0, 100, fields)
	return news.map(item => ({
		id: item.id,
		publishedAt: item.publishedAt,
	}))
}
