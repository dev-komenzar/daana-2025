import type PocketBase from 'pocketbase'
import type { RecordModel } from 'pocketbase'

import type { ProjectRepository, ProjectUpsertInput } from './project-sync'
import type { PbRecordLike } from './upsert-action'

export function createPbProjectRepo(pb: PocketBase): ProjectRepository {
	return {
		async create(input: ProjectUpsertInput) {
			const record = await pb.collection('projects').create(toBody(input))
			return { id: record.id }
		},
		async findByOriginalId(originalId: string): Promise<PbRecordLike | undefined> {
			const escaped = originalId.replaceAll('"', String.raw`\"`)
			try {
				const record = await pb.collection('projects').getFirstListItem(`original_id="${escaped}"`)
				return toPbRecordLike(record)
			} catch (error) {
				if (isNotFound(error)) return undefined
				throw error
			}
		},
		async update(id: string, input: ProjectUpsertInput) {
			const record = await pb.collection('projects').update(id, toBody(input))
			return { id: record.id }
		},
	}
}

function isNotFound(error: unknown): boolean {
	return typeof error === 'object' && error !== null && 'status' in error && (error as { status?: number }).status === 404
}

function toBody(input: ProjectUpsertInput): Record<string, unknown> {
	const body: Record<string, unknown> = {
		body: input.body,
		draft: input.draft ?? false,
		original_id: input.originalId,
		projectLink: input.projectLink,
		published_at: input.publishedAt ?? '',
		revised_at: input.revisedAt ?? '',
		title: input.title,
	}
	if (input.type && input.type.length > 0) {
		body.type = input.type
	}
	return body
}

function toPbRecordLike(record: RecordModel): PbRecordLike {
	return {
		id: record.id,
		originalId: typeof record.original_id === 'string' ? record.original_id : '',
	}
}
