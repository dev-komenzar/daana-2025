import * as v from 'valibot'
import { describe, expect, test } from 'vitest'

import { ProjectItemSchema, ProjectTypeSchema, ReturnProjectApiSchema } from './schema'

describe('ProjectTypeSchema', () => {
	test('"hito" が有効', () => {
		const result = v.safeParse(ProjectTypeSchema, 'hito')
		expect(result.success).toBe(true)
	})

	test('"mono" が有効', () => {
		const result = v.safeParse(ProjectTypeSchema, 'mono')
		expect(result.success).toBe(true)
	})

	test('不正な値はエラー', () => {
		const result = v.safeParse(ProjectTypeSchema, 'invalid')
		expect(result.success).toBe(false)
	})
})

describe('ProjectItemSchema', () => {
	test('必須フィールド id, title, projectLink のみで有効', () => {
		const data = {
			id: 'project-1',
			projectLink: 'https://example.com/project/1',
			title: 'テストプロジェクト',
		}
		const result = v.safeParse(ProjectItemSchema, data)
		expect(result.success).toBe(true)
	})

	test('全フィールドが正しくパースされる', () => {
		const data = {
			body: '<p>本文</p>',
			createdAt: '2023-06-30T00:00:00.000Z',
			id: 'project-1',
			projectLink: 'https://congrant.com/project/jba/12345',
			publishedAt: '2023-06-30T00:00:00.000Z',
			revisedAt: '2023-06-30T00:00:00.000Z',
			title: 'テストプロジェクト',
			type: ['hito'],
			updatedAt: '2023-06-30T00:00:00.000Z',
		}
		const result = v.safeParse(ProjectItemSchema, data)
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.output.id).toBe('project-1')
			expect(result.output.title).toBe('テストプロジェクト')
			expect(result.output.type).toEqual(['hito'])
		}
	})

	test('type が複数の値を持つ場合も有効', () => {
		const data = {
			id: 'project-1',
			projectLink: 'https://example.com/project/1',
			title: 'テストプロジェクト',
			type: ['hito', 'mono'],
		}
		const result = v.safeParse(ProjectItemSchema, data)
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.output.type).toEqual(['hito', 'mono'])
		}
	})

	test('type が undefined でも有効', () => {
		const data = {
			id: 'project-1',
			projectLink: 'https://example.com/project/1',
			title: 'テストプロジェクト',
		}
		const result = v.safeParse(ProjectItemSchema, data)
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.output.type).toBeUndefined()
		}
	})

	test('id が存在しない場合はエラー', () => {
		const data = {
			projectLink: 'https://example.com/project/1',
			title: 'タイトルのみ',
		}
		const result = v.safeParse(ProjectItemSchema, data)
		expect(result.success).toBe(false)
	})

	test('title が存在しない場合はエラー', () => {
		const data = {
			id: 'project-1',
			projectLink: 'https://example.com/project/1',
		}
		const result = v.safeParse(ProjectItemSchema, data)
		expect(result.success).toBe(false)
	})

	test('projectLink が存在しない場合はエラー', () => {
		const data = {
			id: 'project-1',
			title: 'テストプロジェクト',
		}
		const result = v.safeParse(ProjectItemSchema, data)
		expect(result.success).toBe(false)
	})

	test('不正なタイムスタンプはエラー', () => {
		const data = {
			id: 'project-1',
			projectLink: 'https://example.com/project/1',
			publishedAt: 'invalid-date',
			title: 'テストプロジェクト',
		}
		const result = v.safeParse(ProjectItemSchema, data)
		expect(result.success).toBe(false)
	})

	test('不正な type はエラー', () => {
		const data = {
			id: 'project-1',
			projectLink: 'https://example.com/project/1',
			title: 'テストプロジェクト',
			type: ['invalid'],
		}
		const result = v.safeParse(ProjectItemSchema, data)
		expect(result.success).toBe(false)
	})
})

describe('ReturnProjectApiSchema', () => {
	test('有効なAPIレスポンスがパースされる', () => {
		const data = {
			contents: [
				{
					id: 'project-1',
					projectLink: 'https://example.com/1',
					title: 'プロジェクト1',
					type: ['hito'],
				},
				{
					id: 'project-2',
					projectLink: 'https://example.com/2',
					title: 'プロジェクト2',
					type: ['mono'],
				},
			],
			limit: 10,
			offset: 0,
			totalCount: 2,
		}
		const result = v.safeParse(ReturnProjectApiSchema, data)
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.output.contents).toHaveLength(2)
			expect(result.output.totalCount).toBe(2)
		}
	})

	test('空の contents 配列も有効', () => {
		const data = {
			contents: [],
			limit: 10,
			offset: 0,
			totalCount: 0,
		}
		const result = v.safeParse(ReturnProjectApiSchema, data)
		expect(result.success).toBe(true)
	})
})
