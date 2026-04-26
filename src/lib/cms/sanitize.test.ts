import { describe, expect, test } from 'vitest'

import { sanitizeHtml } from './sanitize'

describe('sanitizeHtml', () => {
	test('script タグは完全に除去される', () => {
		const result = sanitizeHtml("<script>alert('xss')</script>")
		expect(result).not.toContain('<script>')
		expect(result).not.toContain('alert')
	})

	test('p タグ内の script は除去されテキストは保持', () => {
		const result = sanitizeHtml('<p>Hello <script>x</script>World</p>')
		expect(result).toBe('<p>Hello World</p>')
	})

	test('許可タグ (p/h1/strong/em/a) は保持', () => {
		const input = '<p><strong>bold</strong></p><h1>title</h1><em>italic</em><a href="#">link</a>'
		const result = sanitizeHtml(input)
		expect(result).toContain('<p>')
		expect(result).toContain('<strong>')
		expect(result).toContain('<h1>')
		expect(result).toContain('<em>')
		expect(result).toContain('<a ')
	})

	test('許可属性 (href, src, alt, style) は保持', () => {
		const input = '<a href="https://example.com">link</a><img src="photo.jpg" alt="photo">'
		const result = sanitizeHtml(input)
		expect(result).toContain('href="https://example.com"')
		expect(result).toContain('src="photo.jpg"')
		expect(result).toContain('alt="photo"')
	})

	test('onclick 属性は除去され要素は保持', () => {
		const result = sanitizeHtml('<a onclick="evil()" href="#">x</a>')
		expect(result).not.toContain('onclick')
		expect(result).toContain('<a ')
		expect(result).toContain('x</a>')
	})

	test('iframe タグは除去', () => {
		const result = sanitizeHtml('<iframe src="https://evil.com"></iframe>')
		expect(result).not.toContain('<iframe')
	})

	test('img の onerror は除去され src/alt は保持', () => {
		const result = sanitizeHtml('<img src="x" alt="img" onerror="evil()">')
		expect(result).not.toContain('onerror')
		expect(result).toContain('src="x"')
		expect(result).toContain('alt="img"')
	})

	test('空文字列は空文字列を返す', () => {
		expect(sanitizeHtml('')).toBe('')
	})

	test('TipTap 出力相当の複雑な HTML が正しく保持される', () => {
		const input = '<p><strong>bold</strong> and <em>italic</em></p><img src="photo.jpg" alt="photo">'
		const result = sanitizeHtml(input)
		expect(result).toContain('<strong>bold</strong>')
		expect(result).toContain('<em>italic</em>')
		expect(result).toContain('<img src="photo.jpg" alt="photo">')
	})
})
