import * as v from 'valibot'

export const ProjectTypeSchema = v.picklist(['mono', 'hito'])

export type ProjectType = v.InferOutput<typeof ProjectTypeSchema>

export const ProjectItemSchema = v.object({
	body: v.optional(v.string()),
	createdAt: v.optional(v.pipe(v.string(), v.isoTimestamp())),
	id: v.string(),
	projectLink: v.string(),
	publishedAt: v.optional(v.pipe(v.string(), v.isoTimestamp())),
	revisedAt: v.optional(v.pipe(v.string(), v.isoTimestamp())),
	title: v.string(),
	type: v.optional(v.array(ProjectTypeSchema)),
	updatedAt: v.optional(v.pipe(v.string(), v.isoTimestamp())),
})

export type ProjectItem = v.InferOutput<typeof ProjectItemSchema>

export type ProjectItemKey = keyof ProjectItem

export const ReturnProjectApiSchema = v.object({
	contents: v.array(ProjectItemSchema),
	limit: v.number(),
	offset: v.number(),
	totalCount: v.number(),
})

export type ReturnProjectApi = v.InferOutput<typeof ReturnProjectApiSchema>
