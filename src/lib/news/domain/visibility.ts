export function isPubliclyVisible(item: { draft?: boolean; publishedAt?: string }, now = new Date()): boolean {
	if (item.draft === true) return false
	if (!item.publishedAt) return true
	const publishDate = new Date(item.publishedAt)
	if (Number.isNaN(publishDate.getTime())) return true
	return publishDate.getTime() <= now.getTime()
}
