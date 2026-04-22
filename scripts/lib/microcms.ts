import ky, { type KyInstance } from 'ky'

export type MicrocmsClientConfig = {
	apiKey: string
	baseUrl?: string
}

export type MicrocmsListResponse<T> = {
	contents: T[]
	limit: number
	offset: number
	totalCount: number
}

const DEFAULT_BASE_URL = 'https://samgha.microcms.io/api/v1/'
const DEFAULT_PAGE_SIZE = 100

export type FetchAllOptions = {
	fields?: readonly string[]
	pageSize?: number
}

export type MicrocmsNewsRaw = {
	content?: string
	createdAt?: string
	id: string
	pinned?: boolean
	publishedAt?: string
	revisedAt?: string
	thumbnail?: {
		height: number
		url: string
		width: number
	}
	title?: string
	updatedAt?: string
}

export type MicrocmsProjectRaw = {
	body?: string
	createdAt?: string
	description?: string
	id: string
	projectLink?: string
	publishedAt?: string
	revisedAt?: string
	thumbnail?: {
		height: number
		url: string
		width: number
	}
	title?: string
	type?: readonly string[]
	updatedAt?: string
}

export function createMicrocmsClient(config: MicrocmsClientConfig): KyInstance {
	if (!config.apiKey) {
		throw new Error('createMicrocmsClient: apiKey is required')
	}
	return ky.create({
		headers: {
			Accept: 'application/json',
			'X-MICROCMS-API-KEY': config.apiKey,
		},
		prefixUrl: config.baseUrl ?? DEFAULT_BASE_URL,
	})
}

export async function fetchAllContents<T>(client: KyInstance, endpoint: string, options: FetchAllOptions = {}): Promise<T[]> {
	const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE
	if (pageSize <= 0) {
		throw new Error('fetchAllContents: pageSize must be > 0')
	}
	const fieldsParam = options.fields && options.fields.length > 0 ? options.fields.join(',') : undefined
	const collected: T[] = []
	let offset = 0
	let safeguard = 0
	for (;;) {
		if (safeguard++ > 10_000) {
			throw new Error(`fetchAllContents: pagination safeguard tripped (endpoint=${endpoint})`)
		}
		const searchParams: Record<string, string> = {
			limit: String(pageSize),
			offset: String(offset),
		}
		if (fieldsParam) searchParams.fields = fieldsParam
		const page = await client.get(endpoint, { searchParams }).json<MicrocmsListResponse<T>>()
		collected.push(...page.contents)
		const reachedTotal = collected.length >= page.totalCount
		const noMoreData = page.contents.length === 0
		if (reachedTotal || noMoreData) break
		offset = collected.length
	}
	return collected
}

export function fetchAllNews(client: KyInstance, options: FetchAllOptions = {}): Promise<MicrocmsNewsRaw[]> {
	return fetchAllContents<MicrocmsNewsRaw>(client, 'news', options)
}

export function fetchAllProjects(client: KyInstance, options: FetchAllOptions = {}): Promise<MicrocmsProjectRaw[]> {
	return fetchAllContents<MicrocmsProjectRaw>(client, 'projects', options)
}
