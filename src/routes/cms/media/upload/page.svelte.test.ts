import { render } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'

import Page from './+page.svelte'

describe('cms/media/upload +page.svelte', () => {
	test('file input がある', () => {
		const { container } = render(Page, { form: undefined })
		const input = container.querySelector('input[type="file"]')
		expect(input).toBeTruthy()
		expect(input).toHaveAttribute('name', 'file')
	})

	test('alt input がある', () => {
		const { container } = render(Page, { form: undefined })
		const input = container.querySelector('input[name="alt"]')
		expect(input).toBeTruthy()
	})

	test('submit ボタンがある', () => {
		const { getByRole } = render(Page, { form: undefined })
		const button = getByRole('button', { name: /アップロード/ })
		expect(button).toBeTruthy()
	})

	test('DnD ドロップゾーン要素がある', () => {
		const { container } = render(Page, { form: undefined })
		const dropzone = container.querySelector('[aria-label="dropzone"]')
		expect(dropzone).toBeTruthy()
	})

	test('form.error が set されているとエラーが表示される', () => {
		const { getByRole } = render(Page, { form: { error: 'ファイルを選択してください' } })
		const alert = getByRole('alert')
		expect(alert).toBeTruthy()
		expect(alert.textContent).toContain('ファイルを選択してください')
	})

	test('form が null ならエラーメッセージは表示されない', () => {
		const { queryByRole } = render(Page, { form: undefined })
		expect(queryByRole('alert')).toBeNull()
	})
})
