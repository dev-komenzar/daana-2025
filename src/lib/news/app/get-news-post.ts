import type { NewsItem } from '../domain/schema'

import { newsRepository } from '../infra/repository'

/**
 * 単一のニュース記事を取得
 * @param id ニュースID
 */
export async function getNewsPost(id: string): Promise<NewsItem | undefined> {
	return newsRepository.getNewsById(id)
}
