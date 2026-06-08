import { render, screen } from '@testing-library/svelte'
import { beforeAll, describe, expect, test, vi } from 'vitest'

import NewsForm from './news-form.svelte'

beforeAll(() => {
	function MockIntersectionObserver() {
		return { disconnect: vi.fn(), observe: vi.fn(), unobserve: vi.fn() }
	}
	vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

const mediaItems = [{ alt: 'Test image', id: 'm1', src: 'https://example.com/img.jpg', thumbUrl: 'https://example.com/thumb.jpg' }]

describe('NewsForm', () => {
	test('フォームが title / thumbnail / published_at / pinned / draft 入力を持つ', () => {
		const { container } = render(NewsForm, { mediaItems, submitLabel: '作成' })

		expect(screen.getByRole('textbox', { name: /タイトル/ })).toBeInTheDocument()
		expect(container.querySelector('input[type="hidden"][name="thumbnail"]')).toBeInTheDocument()
		expect(screen.getByLabelText(/公開日時/)).toBeInTheDocument()
		expect(screen.getByRole('checkbox', { name: /固定/ })).toBeInTheDocument()
		expect(screen.getByRole('checkbox', { name: /下書き/ })).toBeInTheDocument()
	})

	test('submitLabel が ボタンテキストに反映される', () => {
		render(NewsForm, { mediaItems, submitLabel: '更新' })
		expect(screen.getByRole('button', { name: '更新' })).toBeInTheDocument()
	})

	test('submitLabel "作成" でも正しく表示', () => {
		render(NewsForm, { mediaItems, submitLabel: '作成' })
		expect(screen.getByRole('button', { name: '作成' })).toBeInTheDocument()
	})

	test('initial prop の値が各フィールドに入る', () => {
		const { container } = render(NewsForm, {
			initial: {
				draft: true,
				pinned: true,
				thumbnail: 'media-abc',
				title: '既存タイトル',
			},
			mediaItems,
			submitLabel: '更新',
		})

		expect(screen.getByRole('textbox', { name: /タイトル/ })).toHaveValue('既存タイトル')
		const thumbnailInput = container.querySelector('input[type="hidden"][name="thumbnail"]') as HTMLInputElement
		expect(thumbnailInput.value).toBe('media-abc')
		expect(screen.getByRole('checkbox', { name: /固定/ })).toBeChecked()
		expect(screen.getByRole('checkbox', { name: /下書き/ })).toBeChecked()
	})

	test('error prop が設定されると エラーメッセージが表示される', () => {
		render(NewsForm, { error: 'タイトルを入力してください', mediaItems, submitLabel: '作成' })
		expect(screen.getByRole('alert')).toHaveTextContent('タイトルを入力してください')
	})

	test('error prop なしではアラートが表示されない', () => {
		render(NewsForm, { mediaItems, submitLabel: '作成' })
		expect(screen.queryByRole('alert')).toBeNull()
	})
})
