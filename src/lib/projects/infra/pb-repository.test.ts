/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, expect, test, vi } from 'vitest'

vi.mock('$env/static/private', () => ({
	CMS_SOURCE: 'microcms',
	MICROCMS_API_KEY: 'dummy-key',
	PB_URL: 'http://localhost:8090',
}))

import type { ProjectItem } from '../domain/schema'

import { PocketBaseProjectRepository } from './pb-repository'

type CollectionStub = {
	getFirstListItem: ReturnType<typeof vi.fn>
	getList: ReturnType<typeof vi.fn>
	getOne: ReturnType<typeof vi.fn>
}

function createPbStub(collection: Partial<CollectionStub> = {}): { collection: (name: string) => CollectionStub } {
	const stub: CollectionStub = {
		getFirstListItem: vi.fn(),
		getList: vi.fn(),
		getOne: vi.fn(),
		...collection,
	}
	return {
		collection() {
			return stub
		},
	}
}

describe('PocketBaseProjectRepository', () => {
	describe('getProjects', () => {
		test('getFullList 相当 (perPage=500, page=1) でプロジェクトを取得する', async () => {
			const pb = createPbStub({
				getList: vi.fn().mockResolvedValue({ items: [], page: 1, perPage: 500, totalItems: 0, totalPages: 0 }),
			})
			const repo = new PocketBaseProjectRepository(pb as any)

			await repo.getProjects(['id', 'title', 'projectLink', 'type'])

			const getList = pb.collection('projects').getList as ReturnType<typeof vi.fn>
			expect(getList).toHaveBeenCalledTimes(1)
			const [page, perPage, options] = getList.mock.calls[0]
			expect(page).toBe(1)
			expect(perPage).toBe(500)
			expect(options).toMatchObject({ sort: '-published_at' })
		})

		test('PB レコードを ProjectItem にマッピング (type 配列、originalId、ISO 変換)', async () => {
			const pb = createPbStub({
				getList: vi.fn().mockResolvedValue({
					items: [
						{
							body: '<p>本文</p>',
							collectionId: 'col_projects',
							created: '2026-04-22 05:50:28.347Z',
							draft: false,
							id: 'pb-proj-1',
							original_id: 'orig-proj-1',
							projectLink: 'https://congrant.com/project/jba/21244',
							published_at: '2026-02-25 04:49:26.538Z',
							revised_at: '2026-02-25 04:49:26.538Z',
							title: 'てすとプロジェクト',
							type: ['mono'],
							updated: '2026-04-22 05:50:37.169Z',
						},
					],
					page: 1,
					perPage: 500,
					totalItems: 1,
					totalPages: 1,
				}),
			})
			const repo = new PocketBaseProjectRepository(pb as any)
			const projects = await repo.getProjects(['id', 'title', 'projectLink', 'type'])

			expect(projects).toHaveLength(1)
			const p = projects[0] as ProjectItem
			expect(p.id).toBe('pb-proj-1')
			expect(p.originalId).toBe('orig-proj-1')
			expect(p.title).toBe('てすとプロジェクト')
			expect(p.projectLink).toBe('https://congrant.com/project/jba/21244')
			expect(p.body).toBe('<p>本文</p>')
			expect(p.type).toEqual(['mono'])
			expect(p.draft).toBe(false)
			expect(p.publishedAt).toBe('2026-02-25T04:49:26.538Z')
			expect(p.revisedAt).toBe('2026-02-25T04:49:26.538Z')
			expect(p.createdAt).toBe('2026-04-22T05:50:28.347Z')
			expect(p.updatedAt).toBe('2026-04-22T05:50:37.169Z')
		})

		test('type が空文字列の場合 undefined (または空配列) として扱う', async () => {
			const pb = createPbStub({
				getList: vi.fn().mockResolvedValue({
					items: [
						{
							created: '2026-04-22 05:50:28.347Z',
							draft: false,
							id: 'x',
							original_id: '',
							projectLink: 'https://example.com',
							published_at: '2026-02-25 04:49:26.538Z',
							revised_at: '',
							title: 'no type',
							type: '',
							updated: '2026-04-22 05:50:28.347Z',
						},
					],
					page: 1,
					perPage: 500,
					totalItems: 1,
					totalPages: 1,
				}),
			})
			const repo = new PocketBaseProjectRepository(pb as any)
			const projects = await repo.getProjects(['id', 'title', 'projectLink', 'type'])
			expect(projects[0].type).toBeUndefined()
			expect(projects[0].originalId).toBeUndefined()
			expect(projects[0].revisedAt).toBeUndefined()
		})

		test('エラー時は空配列を返す', async () => {
			const pb = createPbStub({
				getList: vi.fn().mockRejectedValue(new Error('network')),
			})
			const repo = new PocketBaseProjectRepository(pb as any)
			const projects = await repo.getProjects(['id'])
			expect(projects).toEqual([])
		})
	})

	describe('getProjectByOriginalId', () => {
		test('original_id フィルタで getFirstListItem を呼び ProjectItem を返す', async () => {
			const pb = createPbStub({
				getFirstListItem: vi.fn().mockResolvedValue({
					created: '2026-04-22 05:50:28.347Z',
					draft: false,
					id: 'pb-proj-xxx',
					original_id: 'old-proj-1',
					projectLink: 'https://example.com',
					published_at: '2026-02-25 04:49:26.538Z',
					revised_at: '2026-02-25 04:49:26.538Z',
					title: 't',
					type: ['hito'],
					updated: '2026-04-22 05:50:28.347Z',
				}),
			})
			const repo = new PocketBaseProjectRepository(pb as any)
			const project = await repo.getProjectByOriginalId('old-proj-1')

			const function_ = pb.collection('projects').getFirstListItem as ReturnType<typeof vi.fn>
			expect(function_).toHaveBeenCalledWith('original_id="old-proj-1"')
			expect(project?.id).toBe('pb-proj-xxx')
			expect(project?.type).toEqual(['hito'])
		})

		test('404 の場合 undefined', async () => {
			const notFound = Object.assign(new Error('not found'), { status: 404 })
			const pb = createPbStub({
				getFirstListItem: vi.fn().mockRejectedValue(notFound),
			})
			const repo = new PocketBaseProjectRepository(pb as any)
			const project = await repo.getProjectByOriginalId('missing')
			expect(project).toBeUndefined()
		})
	})
})
