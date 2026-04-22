import type { MicrocmsNewsRaw } from './microcms'

import { extractImageSrcs, rewriteImageSrcs } from './rewrite-image-srcs'
import { type PbRecordLike, resolveUpsertAction } from './upsert-action'

export type MediaUploader = (sourceUrl: string, alt?: string) => Promise<{ id: string }>

export interface NewsRepository {
	create(input: NewsUpsertInput): Promise<{ id: string }>
	findByOriginalId(originalId: string): Promise<PbRecordLike | undefined>
	update(id: string, input: NewsUpsertInput): Promise<{ id: string }>
}

export type NewsUpsertInput = {
	content: string
	draft?: boolean
	originalId: string
	pinned?: boolean
	publishedAt?: string
	revisedAt?: string
	thumbnailMediaId?: string
	title: string
}

export type SyncNewsDeps = {
	mediaUploader: MediaUploader
	repo: NewsRepository
}

export type SyncResult = { action: 'create'; id: string; originalId: string } | { action: 'update'; id: string; originalId: string }

/**
 * media record の id を指す内部表現。実際の PB ファイル URL は
 * 本文レンダリング側 (ov9.ayq) で解決する想定。移行段階では `pb-media://<id>` を埋めておく。
 */
export function pbFileReference(mediaId: string): string {
	return `pb-media://${mediaId}`
}

export async function syncNewsItem(item: MicrocmsNewsRaw, deps: SyncNewsDeps): Promise<SyncResult> {
	if (!item.id) {
		throw new Error('syncNewsItem: microCMS news id is required')
	}
	if (!item.title) {
		throw new Error(`syncNewsItem: news ${item.id} has empty title`)
	}

	let thumbnailMediaId: string | undefined
	if (item.thumbnail?.url) {
		const thumbnailMedia = await deps.mediaUploader(item.thumbnail.url, item.title)
		thumbnailMediaId = thumbnailMedia.id
	}

	const rawContent = item.content ?? ''
	const urls = extractImageSrcs(rawContent)
	const urlMap = new Map<string, string>()
	for (const url of urls) {
		const media = await deps.mediaUploader(url, item.title)
		urlMap.set(url, pbFileReference(media.id))
	}
	const rewrittenContent = rewriteImageSrcs(rawContent, urlMap)

	const upsertInput: NewsUpsertInput = {
		content: rewrittenContent,
		originalId: item.id,
		pinned: item.pinned ?? false,
		publishedAt: item.publishedAt,
		revisedAt: item.revisedAt,
		thumbnailMediaId,
		title: item.title,
	}

	const existing = await deps.repo.findByOriginalId(item.id)
	const action = resolveUpsertAction(item.id, existing)
	if (action.type === 'create') {
		const created = await deps.repo.create(upsertInput)
		return { action: 'create', id: created.id, originalId: item.id }
	}
	const updated = await deps.repo.update(action.id, upsertInput)
	return { action: 'update', id: updated.id, originalId: item.id }
}
