import { render } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'

import HorizontalDivider from './horizontal-divider.svelte'

describe('HorizontalDivider', () => {
	test('hr 要素が divider class 付きでレンダリングされる', () => {
		const { container } = render(HorizontalDivider)
		const hr = container.querySelector('hr')
		expect(hr).toBeInTheDocument()
		expect(hr).toHaveClass('divider')
	})

	test('marginTop / marginBottom が CSS custom property に反映される', () => {
		const { container } = render(HorizontalDivider, { marginBottom: 32, marginTop: 16 })
		const hr = container.querySelector('hr')
		expect(hr?.style.getPropertyValue('--margin-top')).toBe('16px')
		expect(hr?.style.getPropertyValue('--margin-bottom')).toBe('32px')
	})

	test('color prop が --divider-color に反映される', () => {
		const { container } = render(HorizontalDivider, { color: '#ff0000' })
		const hr = container.querySelector('hr')
		expect(hr?.style.getPropertyValue('--divider-color')).toBe('#ff0000')
	})
})
