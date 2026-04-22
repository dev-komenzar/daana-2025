import type { MicrocmsProjectRaw } from './microcms'
import type { MediaUploader, SyncResult } from './news-sync'
import type { PbRecordLike } from './upsert-action'

import { pbFileReference } from './news-sync'
import { extractImageSrcs, rewriteImageSrcs } from './rewrite-image-srcs'
import { resolveUpsertAction } from './upsert-action'

const ALLOWED_PROJECT_TYPES = new Set(['hito', 'mono'])

export interface ProjectRepository {
	create(input: ProjectUpsertInput): Promise<{ id: string }>
	findByOriginalId(originalId: string): Promise<PbRecordLike | undefined>
	update(id: string, input: ProjectUpsertInput): Promise<{ id: string }>
}

export type ProjectUpsertInput = {
	body: string
	draft?: boolean
	originalId: string
	projectLink: string
	publishedAt?: string
	revisedAt?: string
	title: string
	type?: readonly string[]
}

export type SyncProjectDeps = {
	mediaUploader: MediaUploader
	repo: ProjectRepository
}

export async function syncProjectItem(item: MicrocmsProjectRaw, deps: SyncProjectDeps): Promise<SyncResult> {
	if (!item.id) {
		throw new Error('syncProjectItem: microCMS project id is required')
	}
	if (!item.title) {
		throw new Error(`syncProjectItem: project ${item.id} has empty title`)
	}

	// microCMS 側のキー揺れ (body/description) を吸収する。
	const rawBody = item.body ?? item.description ?? ''
	const urls = extractImageSrcs(rawBody)
	const urlMap = new Map<string, string>()
	for (const url of urls) {
		const media = await deps.mediaUploader(url, item.title)
		urlMap.set(url, pbFileReference(media.id))
	}
	const rewrittenBody = rewriteImageSrcs(rawBody, urlMap)

	const filteredType = (item.type ?? []).filter(value => ALLOWED_PROJECT_TYPES.has(value))

	const upsertInput: ProjectUpsertInput = {
		body: rewrittenBody,
		originalId: item.id,
		projectLink: item.projectLink ?? '',
		publishedAt: item.publishedAt,
		revisedAt: item.revisedAt,
		title: item.title,
		type: filteredType.length > 0 ? filteredType : undefined,
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
