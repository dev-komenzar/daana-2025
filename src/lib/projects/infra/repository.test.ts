/* eslint-disable @typescript-eslint/no-explicit-any */

import * as v from 'valibot'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

vi.mock('$env/static/private', () => ({
	MICROCMS_API_KEY: 'dummy-key',
}))

import type { MockInstance } from 'vitest'

import type { ProjectItem, ReturnProjectApi } from '../domain/schema'

import { api } from '../../news/infra/client'
import { ProjectItemSchema } from '../domain/schema'
import { projectRepository } from './repository'

// =================================================================
// 1. Unit Tests (using mock)
// =================================================================

describe('projectRepository (Unit)', () => {
	let spy: MockInstance

	beforeEach(() => {
		spy = vi.spyOn(api, 'get')
	})

	afterEach(() => {
		spy.mockRestore()
	})

	describe('getProjects', () => {
		test('引数に基づいて正しいURLが生成され、APIが呼び出されること', async () => {
			const mockResponse: ReturnProjectApi = {
				contents: [],
				limit: 10,
				offset: 0,
				totalCount: 0,
			}
			spy.mockReturnValue({
				json: () => Promise.resolve(mockResponse),
			} as any)

			const fields: (keyof ProjectItem)[] = ['id', 'title', 'projectLink', 'type']

			await projectRepository.getProjects(fields)

			const expectedUrl = 'projects?fields=id,title,projectLink,type'
			expect(spy).toHaveBeenCalledWith(expectedUrl)
		})

		test('APIから取得したプロジェクトの contents 配列を返すこと', async () => {
			const mockResponse: ReturnProjectApi = {
				contents: [
					v.parse(ProjectItemSchema, {
						body: '<p>本文1</p>',
						createdAt: '2023-06-30T00:00:00.000Z',
						id: 'project-1',
						projectLink: 'https://congrant.com/project/jba/12345',
						publishedAt: '2023-06-30T00:00:00.000Z',
						revisedAt: '2023-06-30T00:00:00.000Z',
						title: 'テストプロジェクト1',
						type: ['hito'],
						updatedAt: '2023-06-30T00:00:00.000Z',
					}),
					v.parse(ProjectItemSchema, {
						id: 'project-2',
						projectLink: 'https://congrant.com/project/jba/67890',
						title: 'テストプロジェクト2',
						type: ['mono'],
					}),
				],
				limit: 10,
				offset: 0,
				totalCount: 2,
			}

			spy.mockReturnValue({
				json: (): Promise<ReturnProjectApi> => Promise.resolve(mockResponse),
			} as any)

			const projects = await projectRepository.getProjects(['id', 'title', 'projectLink', 'type'])

			expect(projects).toEqual(mockResponse.contents)
			expect(projects).toHaveLength(2)
			expect(projects[0].type).toEqual(['hito'])
			expect(projects[1].type).toEqual(['mono'])
		})

		test('API通信が失敗した場合、空配列を返すこと', async () => {
			const mockError = new Error('API Error')
			spy.mockReturnValue({
				json: () => Promise.reject(mockError),
			} as any)

			const result = await projectRepository.getProjects(['id', 'title', 'projectLink'])
			expect(result).toEqual([])
		})

		test('type が未定義のプロジェクトも正しく処理されること', async () => {
			const mockResponse: ReturnProjectApi = {
				contents: [
					v.parse(ProjectItemSchema, {
						id: 'project-no-type',
						projectLink: 'https://example.com/project',
						title: 'タイプなしプロジェクト',
					}),
				],
				limit: 10,
				offset: 0,
				totalCount: 1,
			}

			spy.mockReturnValue({
				json: (): Promise<ReturnProjectApi> => Promise.resolve(mockResponse),
			} as any)

			const projects = await projectRepository.getProjects(['id', 'title', 'projectLink', 'type'])

			expect(projects).toHaveLength(1)
			expect(projects[0].type).toBeUndefined()
		})
	})
})

// =================================================================
// 2. Integration Tests (calling actual API)
// =================================================================

const hasApiKey = process.env.MICROCMS_API_KEY !== undefined
const isIntegrationTest = process.env.TEST_INTEGRATION === 'true'

describe.skipIf(!isIntegrationTest || !hasApiKey)('projectRepository (Integration)', () => {
	test('実際のAPIからProjectItemの配列を取得し、スキーマが一致すること', async () => {
		vi.setConfig({ testTimeout: 10_000 })

		let result: ProjectItem[] | undefined
		let error: Error | undefined

		try {
			result = await projectRepository.getProjects(['id', 'title', 'projectLink', 'type'])
		} catch (error_) {
			error = error_ as Error
		}

		expect(error).toBeUndefined()
		expect(Array.isArray(result)).toBe(true)

		const schema = v.array(
			v.object({
				id: v.string(),
				projectLink: v.string(),
				title: v.string(),
				type: v.optional(v.array(v.picklist(['hito', 'mono']))),
			}),
		)
		expect(v.safeParse(schema, result).success).toBe(true)
	})
})
