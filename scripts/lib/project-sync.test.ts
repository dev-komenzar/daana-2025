import { describe, expect, test, vi } from 'vitest'

import type { MicrocmsProjectRaw } from './microcms'
import type { PbRecordLike } from './upsert-action'

import { type ProjectRepository, type ProjectUpsertInput, syncProjectItem } from './project-sync'

function createStubRepo(seed: Array<PbRecordLike & ProjectUpsertInput> = []) {
	const store = new Map<string, PbRecordLike & ProjectUpsertInput>(seed.map(r => [r.originalId, r]))
	const created: ProjectUpsertInput[] = []
	const updated: Array<{ id: string; input: ProjectUpsertInput }> = []
	const repo: ProjectRepository = {
		async create(input) {
			const id = `proj-${store.size + 1}`
			store.set(input.originalId, { ...input, id })
			created.push(input)
			return { id }
		},
		async findByOriginalId(originalId) {
			const record = store.get(originalId)
			if (!record) return
			return { id: record.id, originalId: record.originalId }
		},
		async update(id, input) {
			store.set(input.originalId, { ...input, id })
			updated.push({ id, input })
			return { id }
		},
	}
	return { created, repo, store, updated }
}

function stubMediaUploader() {
	let count = 0
	return vi.fn(async () => {
		count += 1
		return { id: `media-${count}` }
	})
}

const sample: MicrocmsProjectRaw = {
	body: '<p>概要</p><img src="https://images.microcms-assets.io/assets/p.jpg" alt="p" />',
	id: 'proj-001',
	projectLink: 'https://example.com/project',
	publishedAt: '2025-10-01T00:00:00.000Z',
	title: 'プロジェクト1',
	type: ['mono', 'hito'],
}

describe('syncProjectItem (daana-ov9.8)', () => {
	test('新規 → create、本文画像 URL が pb-media に書換わる', async () => {
		const { created, repo } = createStubRepo()
		const uploader = stubMediaUploader()

		const result = await syncProjectItem(sample, { mediaUploader: uploader, repo })

		expect(result.action).toBe('create')
		expect(created).toHaveLength(1)
		expect(created[0]?.body).toContain('pb-media://media-1')
		expect(created[0]?.body).not.toContain('images.microcms-assets.io')
		expect(created[0]?.projectLink).toBe('https://example.com/project')
		expect(created[0]?.type).toEqual(['mono', 'hito'])
	})

	test('同じ originalId は update (冪等)', async () => {
		const { created, repo, updated } = createStubRepo([{ body: '', id: 'pb-old', originalId: 'proj-001', projectLink: '', title: 'old' }])
		const uploader = stubMediaUploader()

		const result = await syncProjectItem(sample, { mediaUploader: uploader, repo })

		expect(result.action).toBe('update')
		expect(updated).toHaveLength(1)
		expect(created).toHaveLength(0)
	})

	test('type の未知値は除去される (PB の select 制約)', async () => {
		const { created, repo } = createStubRepo()
		const uploader = stubMediaUploader()
		const mixed: MicrocmsProjectRaw = {
			...sample,
			id: 'proj-002',
			type: ['mono', 'xxx' as unknown as 'mono'],
		}

		await syncProjectItem(mixed, { mediaUploader: uploader, repo })

		expect(created[0]?.type).toEqual(['mono'])
	})

	test('body が description 側でも取り込める', async () => {
		const { created, repo } = createStubRepo()
		const uploader = stubMediaUploader()
		const legacy: MicrocmsProjectRaw = {
			description: '<p>旧 body 相当</p>',
			id: 'proj-legacy',
			projectLink: 'https://example.com/legacy',
			title: 'legacy',
		}

		await syncProjectItem(legacy, { mediaUploader: uploader, repo })

		expect(created[0]?.body).toContain('旧 body 相当')
	})

	test('二度流しても create=1 / update=1 (受入基準)', async () => {
		const { created, repo, updated } = createStubRepo()
		const uploader = stubMediaUploader()

		await syncProjectItem(sample, { mediaUploader: uploader, repo })
		await syncProjectItem(sample, { mediaUploader: uploader, repo })

		expect(created).toHaveLength(1)
		expect(updated).toHaveLength(1)
	})
})
