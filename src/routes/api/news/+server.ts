import { getNewsAsync } from '$lib/news/app'
import { NewsItemSchema } from '$lib/news/domain/schema'
import { json } from '@sveltejs/kit'
import * as v from 'valibot'

import type { RequestHandler } from './$types'

const QuerySchema = v.object({
	fields: v.optional(v.string()),
	limit: v.pipe(v.string(), v.transform(Number), v.number()),
	offset: v.pipe(v.string(), v.transform(Number), v.number()),
})

export const GET: RequestHandler = async ({ url }) => {
	const parameters = Object.fromEntries(url.searchParams)

	const result = v.safeParse(QuerySchema, parameters)
	if (!result.success) {
		return json({ error: 'Invalid parameters' }, { status: 400 })
	}

	const { fields: fieldsParameter, limit, offset } = result.output

	const fields = fieldsParameter ? (fieldsParameter.split(',') as (keyof v.InferOutput<typeof NewsItemSchema>)[]) : (['id', 'title', 'publishedAt', 'thumbnail'] as const)

	const news = await getNewsAsync(offset, limit, [...fields])

	return json(news)
}
