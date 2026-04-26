import consola from 'consola'

import type { INewsRepository } from '../domain/repository'
import type { NewsItem, NewsItemKey } from '../domain/schema'

import { buildPbFileUrl, pbBaseUrl, pbClient } from '../../pb/client'
import { isPubliclyVisible } from '../domain/visibility'

type PbCollectionLike = {
	getFirstListItem: (filter: string, options?: Record<string, unknown>) => Promise<PbRecord>
	getList: (page: number, perPage: number, options?: Record<string, unknown>) => Promise<PbListResult>
	getOne: (id: string, options?: Record<string, unknown>) => Promise<PbRecord>
}

type PbLike = {
	collection: (name: string) => PbCollectionLike
}

type PbListResult = {
	items: PbRecord[]
	page: number
	perPage: number
	totalItems: number
	totalPages: number
}

/** PocketBase Record-like shape (SDK RecordModel に合わせた最小型) */
type PbRecord = {
	// editor / その他任意フィールド
	content?: string
	created?: string
	draft?: boolean
	expand?: Record<string, unknown>
	id: string
	original_id?: string
	pinned?: boolean
	published_at?: string
	revised_at?: string
	thumbnail?: string
	title?: string
	updated?: string
}

const NEWS_COLLECTION = 'news'

export class PocketBaseNewsRepository implements INewsRepository {
	constructor(
		private readonly pb: PbLike,
		private readonly baseUrl: string,
	) {}

	async getNews(offset: number, limit: number, _fields: NewsItemKey[]): Promise<NewsItem[]> {
		try {
			const page = Math.floor(offset / limit) + 1
			const result = await this.pb.collection(NEWS_COLLECTION).getList(page, limit, {
				expand: 'thumbnail',
				filter: 'draft != true && (published_at = "" || published_at <= @now)',
				sort: '-published_at',
			})
			consola.info(`Loaded ${result.items.length} news from PocketBase`)
			return result.items.map(item => this.toNewsItem(item))
		} catch (error) {
			consola.error('Error fetching news from PocketBase:', error)
			return []
		}
	}

	async getNewsById(id: string): Promise<NewsItem | undefined> {
		try {
			const record = await this.pb.collection(NEWS_COLLECTION).getOne(id, { expand: 'thumbnail' })
			const item = this.toNewsItem(record)
			if (!isPubliclyVisible(item)) return undefined
			return { ...item, content: await this.resolvePbMediaRefs(item.content) }
		} catch (error) {
			if (isNotFound(error)) return undefined
			consola.error(`Error fetching news ${id} from PocketBase:`, error)
			return undefined
		}
	}

	async getNewsByOriginalId(originalId: string): Promise<NewsItem | undefined> {
		try {
			const escaped = originalId.replaceAll('"', String.raw`\"`)
			const record = await this.pb.collection(NEWS_COLLECTION).getFirstListItem(`original_id="${escaped}"`, { expand: 'thumbnail' })
			const item = this.toNewsItem(record)
			if (!isPubliclyVisible(item)) return undefined
			return { ...item, content: await this.resolvePbMediaRefs(item.content) }
		} catch (error) {
			if (isNotFound(error)) return undefined
			consola.error(`Error fetching news by originalId ${originalId} from PocketBase:`, error)
			return undefined
		}
	}

	async getPinnedNews(limit: number, _fields: NewsItemKey[]): Promise<NewsItem[]> {
		try {
			const result = await this.pb.collection(NEWS_COLLECTION).getList(1, limit, {
				expand: 'thumbnail',
				filter: 'pinned=true && draft != true && (published_at = "" || published_at <= @now)',
				sort: '-published_at',
			})
			consola.info(`Loaded ${result.items.length} pinned news from PocketBase`)
			return result.items.map(item => this.toNewsItem(item))
		} catch (error) {
			consola.error('Error fetching pinned news from PocketBase:', error)
			return []
		}
	}

	async getTotalCount(): Promise<number> {
		try {
			const result = await this.pb.collection(NEWS_COLLECTION).getList(1, 1)
			return result.totalItems
		} catch (error) {
			consola.error('Error fetching news total count from PocketBase:', error)
			return 0
		}
	}

	private async resolvePbMediaRefs(html: string | undefined): Promise<string | undefined> {
		if (!html) return html
		const ids = [...new Set([...html.matchAll(/pb-media:\/\/([a-zA-Z0-9]+)/g)].map(m => m[1]))]
		if (ids.length === 0) return html

		const urlMap = new Map<string, string>()
		await Promise.all(
			ids.map(async id => {
				try {
					const record = (await this.pb.collection('media').getOne(id)) as unknown as { file?: string }
					if (record.file) {
						urlMap.set(id, buildPbFileUrlWithBase(this.baseUrl, 'media', id, record.file))
					}
				} catch {
					// leave unresolved if media record missing
				}
			}),
		)

		let result = html
		for (const [id, url] of urlMap) {
			result = result.replaceAll(`pb-media://${id}`, url)
		}
		return result
	}

	private toNewsItem(record: PbRecord): NewsItem {
		const thumbRelationId = typeof record.thumbnail === 'string' ? record.thumbnail : ''
		const expandedThumb = record.expand && typeof record.expand === 'object' ? (record.expand as { thumbnail?: { collectionId?: string; file?: string; height?: number; id?: string; width?: number } }).thumbnail : undefined

		let thumbnail: NewsItem['thumbnail']
		if (thumbRelationId && expandedThumb?.file && typeof expandedThumb.width === 'number' && typeof expandedThumb.height === 'number') {
			const collection = expandedThumb.collectionId ?? 'media'
			const mediaId = expandedThumb.id ?? thumbRelationId
			thumbnail = {
				height: expandedThumb.height,
				url: buildPbFileUrlWithBase(this.baseUrl, collection, mediaId, expandedThumb.file),
				width: expandedThumb.width,
			}
		}

		return {
			content: record.content,
			createdAt: normalize(record.created),
			draft: record.draft,
			id: record.id,
			originalId: record.original_id && record.original_id !== '' ? record.original_id : undefined,
			pinned: record.pinned,
			publishedAt: normalize(record.published_at),
			revisedAt: normalize(record.revised_at),
			thumbnail,
			title: record.title,
			updatedAt: normalize(record.updated),
		}
	}
}

function buildPbFileUrlWithBase(baseUrl: string, collectionIdOrName: string, recordId: string, filename: string): string {
	if (baseUrl === pbBaseUrl) return buildPbFileUrl(collectionIdOrName, recordId, filename)
	return `${baseUrl}/api/files/${collectionIdOrName}/${recordId}/${filename}`
}

function isNotFound(error: unknown): boolean {
	return typeof error === 'object' && error !== null && 'status' in error && (error as { status?: number }).status === 404
}

function normalize(value: unknown): string | undefined {
	if (typeof value !== 'string' || value === '') return undefined
	return value.replace(' ', 'T')
}

export const pbNewsRepository: INewsRepository = new PocketBaseNewsRepository(pbClient, pbBaseUrl)
