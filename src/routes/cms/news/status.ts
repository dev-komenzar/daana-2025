export type NewsStatus = 'draft' | 'published' | 'scheduled'

export function statusOf(item: { draft?: boolean; published_at?: string }, now = new Date()): NewsStatus {
	if (item.draft === true) return 'draft'
	if (!item.published_at) return 'published'
	const publishDate = new Date(item.published_at)
	if (Number.isNaN(publishDate.getTime())) return 'published'
	return publishDate.getTime() > now.getTime() ? 'scheduled' : 'published'
}
