import type { NewsItemKey } from '$lib/cms'

import { prerender, query } from '$app/server'
import { getNewsAsync, getNewsTotalCount, NewsItemSchema } from '$lib/cms'
import * as v from 'valibot'

// prerender版: トップページ用 (3件、content含む)
export const getNewsSectionPrerender = prerender(async () => {
	const fields: NewsItemKey[] = ['id', 'title', 'publishedAt', 'thumbnail', 'content']
	return await getNewsAsync(0, 3, fields)
})

// prerender版: ニュース一覧初期表示用 (10件)
export const getNewsListPrerender = prerender(async () => {
	const fields: NewsItemKey[] = ['id', 'title', 'publishedAt', 'thumbnail']
	return await getNewsAsync(0, 10, fields)
})

// prerender版: 総件数取得用
export const getNewsTotalCountPrerender = prerender(async () => {
	return await getNewsTotalCount()
})

// query版: 追加読み込み用 (動的)
export const getNewsRemote = query(
	v.object({
		fields: v.array(v.keyof(NewsItemSchema)),
		limit: v.number(),
		offset: v.number(),
	}),
	async ({ fields, limit, offset }: { fields: NewsItemKey[]; limit: number; offset: number }) => {
		const contents = await getNewsAsync(offset, limit, fields)
		return contents
	},
)
