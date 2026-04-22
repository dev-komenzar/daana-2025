import { http, HttpResponse } from 'msw'
import { describe, expect, test } from 'vitest'

import type { MediaRepository, UploadedMedia } from './media-upload'
import type { NewsRepository } from './news-sync'
import type { ProjectRepository } from './project-sync'

import { server, setupMswServer } from '../test-utils/msw-server'
import { createMicrocmsClient } from './microcms'
import { runMigration } from './migrate-runner'

setupMswServer()

const MICROCMS_BASE = 'https://samgha.microcms.io/api/v1'

function createMemoryMediaRepo(): MediaRepository & { count: () => number } {
	const store = new Map<string, UploadedMedia>()
	return {
		count: () => store.size,
		async create(input) {
			const rec: UploadedMedia = {
				fileUrl: `http://pb.local/${input.fileName}`,
				id: `media-${store.size + 1}`,
				mime: input.mime,
				originalUrl: input.originalUrl,
			}
			store.set(input.originalUrl, rec)
			return rec
		},
		async findByOriginalUrl(url) {
			return store.get(url)
		},
	}
}

function createMemoryNewsRepo(): NewsRepository & { created: unknown[]; updated: unknown[] } {
	const store = new Map<string, { id: string; originalId: string }>()
	const created: unknown[] = []
	const updated: unknown[] = []
	return {
		async create(input) {
			const id = `n-${store.size + 1}`
			store.set(input.originalId, { id, originalId: input.originalId })
			created.push(input)
			return { id }
		},
		created,
		async findByOriginalId(id) {
			return store.get(id)
		},
		async update(id, input) {
			updated.push({ id, input })
			return { id }
		},
		updated,
	}
}

function createMemoryProjectRepo(): ProjectRepository & { created: unknown[]; updated: unknown[] } {
	const store = new Map<string, { id: string; originalId: string }>()
	const created: unknown[] = []
	const updated: unknown[] = []
	return {
		async create(input) {
			const id = `p-${store.size + 1}`
			store.set(input.originalId, { id, originalId: input.originalId })
			created.push(input)
			return { id }
		},
		created,
		async findByOriginalId(id) {
			return store.get(id)
		},
		async update(id, input) {
			updated.push({ id, input })
			return { id }
		},
		updated,
	}
}

const fakeFetchImage = async () => Buffer.from('bytes')
const fakeOptimizer = async () => ({
	buffer: Buffer.from('opt'),
	format: 'jpeg',
	height: 800,
	width: 1200,
})

describe('runMigration (daana-ov9.9 orchestrator)', () => {
	test('news + projects を順に処理してレポートを返す', async () => {
		const microcms = createMicrocmsClient({ apiKey: 'test' })
		const mediaRepo = createMemoryMediaRepo()
		const newsRepo = createMemoryNewsRepo()
		const projectRepo = createMemoryProjectRepo()

		const report = await runMigration({
			dryRun: false,
			fetchImage: fakeFetchImage,
			mediaRepo,
			microcms,
			newsRepo,
			optimizer: fakeOptimizer,
			projectRepo,
			target: 'all',
		})

		expect(report.news.created).toBe(2)
		expect(report.projects.created).toBe(1)
		expect(report.media.created).toBeGreaterThan(0)
		expect(report.news.errors).toEqual([])
	})

	test('二度流しで update 経路に入り、media は reused が増える (冪等)', async () => {
		const microcms = createMicrocmsClient({ apiKey: 'test' })
		const mediaRepo = createMemoryMediaRepo()
		const newsRepo = createMemoryNewsRepo()
		const projectRepo = createMemoryProjectRepo()

		const deps = {
			dryRun: false,
			fetchImage: fakeFetchImage,
			mediaRepo,
			microcms,
			newsRepo,
			optimizer: fakeOptimizer,
			projectRepo,
			target: 'all' as const,
		}

		await runMigration(deps)
		const second = await runMigration(deps)

		expect(second.news.updated).toBe(2)
		expect(second.news.created).toBe(0)
		expect(second.projects.updated).toBe(1)
		expect(second.media.reused).toBeGreaterThan(0)
		expect(second.media.created).toBe(0)
	})

	test('target=news なら projects は触らない', async () => {
		const microcms = createMicrocmsClient({ apiKey: 'test' })
		const mediaRepo = createMemoryMediaRepo()
		const newsRepo = createMemoryNewsRepo()
		const projectRepo = createMemoryProjectRepo()

		const report = await runMigration({
			dryRun: false,
			fetchImage: fakeFetchImage,
			mediaRepo,
			microcms,
			newsRepo,
			optimizer: fakeOptimizer,
			projectRepo,
			target: 'news',
		})

		expect(report.news.created).toBe(2)
		expect(report.projects.created).toBe(0)
		expect(projectRepo.created).toHaveLength(0)
	})

	test('個別 item の失敗はレポートに記録され後続に波及しない', async () => {
		const microcms = createMicrocmsClient({ apiKey: 'test' })
		const mediaRepo = createMemoryMediaRepo()
		const projectRepo = createMemoryProjectRepo()

		// news-002 だけ title が欠けるケース
		server.use(
			http.get(`${MICROCMS_BASE}/news`, () =>
				HttpResponse.json({
					contents: [
						{ id: 'news-001', title: 'ok' },
						{ id: 'news-002', title: '' },
					],
					limit: 100,
					offset: 0,
					totalCount: 2,
				}),
			),
		)

		const newsRepo = createMemoryNewsRepo()
		const report = await runMigration({
			dryRun: false,
			fetchImage: fakeFetchImage,
			mediaRepo,
			microcms,
			newsRepo,
			optimizer: fakeOptimizer,
			projectRepo,
			target: 'news',
		})

		expect(report.news.created).toBe(1)
		expect(report.news.errors).toHaveLength(1)
		expect(report.news.errors[0]?.originalId).toBe('news-002')
	})
})
