import * as v from 'valibot'

export const NewsItemSchema = v.object({
	content: v.optional(v.string()),
	createdAt: v.optional(v.pipe(v.string(), v.isoTimestamp())),
	id: v.string(),
	pinned: v.optional(v.boolean()),
	publishedAt: v.optional(v.pipe(v.string(), v.isoTimestamp())),
	revisedAt: v.optional(v.pipe(v.string(), v.isoTimestamp())),
	thumbnail: v.optional(
		v.object({
			height: v.number(),
			url: v.string(),
			width: v.number(),
		}),
	),
	title: v.optional(v.string()),
	updatedAt: v.optional(v.pipe(v.string(), v.isoTimestamp())),
})

export type NewsItem = v.InferOutput<typeof NewsItemSchema>

export type NewsItemKey = keyof NewsItem

export const ReturnNewApiSchema = v.object({
	contents: v.array(NewsItemSchema),
	limit: v.number(),
	offset: v.number(),
	totalCount: v.number(),
})

export type ReturnNewApi = v.InferOutput<typeof ReturnNewApiSchema>
