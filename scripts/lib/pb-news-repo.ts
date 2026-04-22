import type PocketBase from 'pocketbase'
import type { RecordModel } from 'pocketbase'

import type { NewsRepository, NewsUpsertInput } from './news-sync'
import type { PbRecordLike } from './upsert-action'

export function createPbNewsRepo(pb: PocketBase): NewsRepository {
	return {
		async create(input: NewsUpsertInput) {
			const record = await pb.collection('news').create(toBody(input))
			return { id: record.id }
		},
		async findByOriginalId(originalId: string): Promise<PbRecordLike | undefined> {
			const escaped = originalId.replaceAll('"', String.raw`\"`)
			try {
				const record = await pb.collection('news').getFirstListItem(`original_id="${escaped}"`)
				return toPbRecordLike(record)
			} catch (error) {
				if (isNotFound(error)) return undefined
				throw error
			}
		},
		async update(id: string, input: NewsUpsertInput) {
			const record = await pb.collection('news').update(id, toBody(input))
			return { id: record.id }
		},
	}
}

function isNotFound(error: unknown): boolean {
	return typeof error === 'object' && error !== null && 'status' in error && (error as { status?: number }).status === 404
}

function toBody(input: NewsUpsertInput): Record<string, unknown> {
	const body: Record<string, unknown> = {
		content: input.content,
		draft: input.draft ?? false,
		original_id: input.originalId,
		pinned: input.pinned ?? false,
		published_at: input.publishedAt ?? '',
		revised_at: input.revisedAt ?? '',
		title: input.title,
	}
	// thumbnail は relation。媒体が無い場合は空文字でクリアする (PocketBase の relation 規約)。
	body.thumbnail = input.thumbnailMediaId ?? ''
	return body
}

function toPbRecordLike(record: RecordModel): PbRecordLike {
	return {
		id: record.id,
		originalId: typeof record.original_id === 'string' ? record.original_id : '',
	}
}
