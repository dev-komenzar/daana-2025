import consola from 'consola'

import type { IProjectRepository } from '../domain/repository'
import type { ProjectItem, ProjectItemKey, ProjectType } from '../domain/schema'

import { pbClient } from '../../pb/client'

type PbCollectionLike = {
	getFirstListItem: (filter: string, options?: Record<string, unknown>) => Promise<PbRecord>
	getList: (page: number, perPage: number, options?: Record<string, unknown>) => Promise<PbListResult>
	getOne: (id: string, options?: Record<string, unknown>) => Promise<PbRecord>
}

type PbLike = {
	collection: (name: string) => PbCollectionLike
}

type PbListResult = {
	items: PbRecord[]
	page: number
	perPage: number
	totalItems: number
	totalPages: number
}

type PbRecord = {
	body?: string
	created?: string
	draft?: boolean
	id: string
	original_id?: string
	projectLink?: string
	published_at?: string
	revised_at?: string
	title?: string
	type?: string | string[]
	updated?: string
}

const PROJECTS_COLLECTION = 'projects'
const FULL_LIST_PAGE_SIZE = 500

export class PocketBaseProjectRepository implements IProjectRepository {
	constructor(private readonly pb: PbLike) {}

	async getProjectByOriginalId(originalId: string): Promise<ProjectItem | undefined> {
		try {
			const escaped = originalId.replaceAll('"', String.raw`\"`)
			const record = await this.pb.collection(PROJECTS_COLLECTION).getFirstListItem(`original_id="${escaped}"`)
			return toProjectItem(record)
		} catch (error) {
			if (isNotFound(error)) return undefined
			consola.error(`Error fetching project by originalId ${originalId} from PocketBase:`, error)
			return undefined
		}
	}

	async getProjects(_fields: ProjectItemKey[]): Promise<ProjectItem[]> {
		try {
			const result = await this.pb.collection(PROJECTS_COLLECTION).getList(1, FULL_LIST_PAGE_SIZE, {
				sort: '-published_at',
			})
			consola.info(`Loaded ${result.items.length} projects from PocketBase`)
			return result.items.map(item => toProjectItem(item))
		} catch (error) {
			consola.error('Error fetching projects from PocketBase:', error)
			return []
		}
	}
}

function isNotFound(error: unknown): boolean {
	return typeof error === 'object' && error !== null && 'status' in error && (error as { status?: number }).status === 404
}

function normalize(value: unknown): string | undefined {
	if (typeof value !== 'string' || value === '') return undefined
	return value.replace(' ', 'T')
}

function normalizeType(value: unknown): ProjectType[] | undefined {
	if (!value) return undefined
	if (Array.isArray(value)) {
		const filtered = value.filter((v): v is ProjectType => v === 'mono' || v === 'hito')
		return filtered.length > 0 ? filtered : undefined
	}
	return undefined
}

function toProjectItem(record: PbRecord): ProjectItem {
	return {
		body: record.body && record.body !== '' ? record.body : undefined,
		createdAt: normalize(record.created),
		draft: record.draft,
		id: record.id,
		originalId: record.original_id && record.original_id !== '' ? record.original_id : undefined,
		projectLink: record.projectLink ?? '',
		publishedAt: normalize(record.published_at),
		revisedAt: normalize(record.revised_at),
		title: record.title ?? '',
		type: normalizeType(record.type),
		updatedAt: normalize(record.updated),
	}
}

export const pbProjectRepository: IProjectRepository & { getProjectByOriginalId(originalId: string): Promise<ProjectItem | undefined> } = new PocketBaseProjectRepository(pbClient)
