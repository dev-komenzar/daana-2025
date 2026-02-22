import type { Options } from 'ky'

import consola from 'consola'
import * as v from 'valibot'

import type { INewsRepository } from '../domain/repository'
import type { NewsItem, NewsItemKey, ReturnNewApi } from '../domain/schema'

import { NewsItemSchema, ReturnNewApiSchema } from '../domain/schema'
import { api, isApiConfigured } from './client'

class MicroCmsNewsRepository implements INewsRepository {
	async getNews(offset: number, limit: number, fields: NewsItemKey[]): Promise<NewsItem[]> {
		if (!isApiConfigured) {
			consola.warn('MICROCMS_API_KEY is not configured. Returning empty news list.')
			return []
		}

		const link = this.generateLink(offset, limit, fields)

		try {
			const data = await this.fetchCms<ReturnNewApi>(link)
			consola.info(`Loaded ${data.contents.length} news`)
			return data.contents
		} catch (error) {
			consola.error('Error fetching news from microCMS:', error)
			return []
		}
	}

	async getNewsById(id: string): Promise<NewsItem | undefined> {
		if (!isApiConfigured) {
			consola.warn('MICROCMS_API_KEY is not configured. Cannot fetch news post.')
			return undefined
		}

		const link = `news/${id}`

		try {
			const data = await this.fetchCmsSingle<NewsItem>(link)
			consola.info(`Loaded news post: ${id}`)
			return data
		} catch (error) {
			consola.error(`Error fetching news post ${id} from microCMS:`, error)
			return undefined
		}
	}

	async getPinnedNews(limit: number, fields: NewsItemKey[]): Promise<NewsItem[]> {
		if (!isApiConfigured) {
			consola.warn('MICROCMS_API_KEY is not configured. Returning empty pinned news list.')
			return []
		}

		const flatFields = fields.join(',')
		const link = `news?limit=${limit}&fields=${flatFields}&filters=pinned[equals]true`

		try {
			const data = await this.fetchCms<ReturnNewApi>(link)
			consola.info(`Loaded ${data.contents.length} pinned news`)
			return data.contents
		} catch (error) {
			consola.error('Error fetching pinned news from microCMS:', error)
			return []
		}
	}

	async getTotalCount(): Promise<number> {
		if (!isApiConfigured) {
			consola.warn('MICROCMS_API_KEY is not configured. Returning zero count.')
			return 0
		}

		const link = 'news?limit=1&fields=id'

		try {
			const data = await this.fetchCms<ReturnNewApi>(link)
			consola.info(`Total news count: ${data.totalCount}`)
			return data.totalCount
		} catch (error) {
			consola.error('Error fetching news total count from microCMS:', error)
			return 0
		}
	}

	private async fetchCms<T>(link: string, options?: Options): Promise<T> {
		consola.start(`fetching microCMS: ${link}`)
		const json = await api.get(link, options).json<T>()
		v.parse(ReturnNewApiSchema, json)
		consola.success(`fetching success: ${link}`)
		return json
	}

	private async fetchCmsSingle<T>(link: string, options?: Options): Promise<T> {
		consola.start(`fetching microCMS: ${link}`)
		const json = await api.get(link, options).json<T>()
		v.parse(NewsItemSchema, json)
		consola.success(`fetching success: ${link}`)
		return json
	}

	private generateLink(offset: number, limit: number, fields: NewsItemKey[]): string {
		const flatFields = fields.join(',')
		return `news?offset=${offset}&limit=${limit}&fields=${flatFields}`
	}
}

export const newsRepository: INewsRepository = new MicroCmsNewsRepository()
