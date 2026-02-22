import { newsRepository } from '../infra/repository'

/**
 * ニュースの総件数を取得
 */
export async function getNewsTotalCount(): Promise<number> {
	return newsRepository.getTotalCount()
}
