import type { NewsItem } from '../domain/schema'

import { newsRepository } from '../infra/repository'

/**
 * originalId (microCMS 時代の ID) で 1 件取得
 * @param originalId 検索する originalId
 */
export async function getNewsByOriginalId(originalId: string): Promise<NewsItem | undefined> {
	return newsRepository.getNewsByOriginalId(originalId)
}
