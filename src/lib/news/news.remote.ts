import { prerender, query } from '$app/server'
import * as v from 'valibot'

import type { NewsItemKey } from './domain/schema'

import { NewsItemSchema } from './domain/schema'
import { newsRepository } from './infra/repository'

// prerender版: トップページ用 (3件、content含む)
export const getNewsSectionPrerender = prerender(async () => {
	const fields: NewsItemKey[] = ['id', 'title', 'publishedAt', 'thumbnail', 'content']
	return await newsRepository.getNews(0, 3, fields)
})

// prerender版: ニュース一覧初期表示用 (10件)
export const getNewsListPrerender = prerender(async () => {
	const fields: NewsItemKey[] = ['id', 'title', 'publishedAt', 'thumbnail']
	return await newsRepository.getNews(0, 10, fields)
})

// prerender版: 総件数取得用
export const getNewsTotalCountPrerender = prerender(async () => {
	return await newsRepository.getTotalCount()
})

// prerender版: ピン留めニュース用
export const getPinnedNewsPrerender = prerender(async () => {
	const fields: NewsItemKey[] = ['id', 'title', 'publishedAt', 'thumbnail', 'content']
	return await newsRepository.getPinnedNews(5, fields)
})

// query版: 追加読み込み用 (動的)
export const getNewsRemote = query(
	v.object({
		fields: v.array(v.keyof(NewsItemSchema)),
		limit: v.number(),
		offset: v.number(),
	}),
	async ({ fields, limit, offset }: { fields: NewsItemKey[]; limit: number; offset: number }) => {
		return await newsRepository.getNews(offset, limit, fields)
	},
)

// query版: ピン留めニュース用 (動的)
export const getPinnedNewsRemote = query(
	v.object({
		fields: v.array(v.keyof(NewsItemSchema)),
		limit: v.number(),
	}),
	async ({ fields, limit }: { fields: NewsItemKey[]; limit: number }) => {
		return await newsRepository.getPinnedNews(limit, fields)
	},
)
