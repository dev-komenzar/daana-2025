import { describe, expect, test } from 'vitest'

import { rewriteImageSrcs } from './rewrite-image-srcs'

// Red: Green 実装 (daana-ov9.6) 完了までは全件失敗する想定。
describe('rewriteImageSrcs (daana-275 Red → daana-ov9.6 Green)', () => {
	test('単一の <img src> が urlMap に従って書換わる', () => {
		const html = '<p>foo</p><img src="https://images.microcms-assets.io/assets/a.jpg" alt="a" />'
		const urlMap = new Map([['https://images.microcms-assets.io/assets/a.jpg', 'http://pb.local/api/files/media/xyz/a.jpg']])

		const result = rewriteImageSrcs(html, urlMap)

		expect(result).toContain('src="http://pb.local/api/files/media/xyz/a.jpg"')
		expect(result).not.toContain('images.microcms-assets.io')
		expect(result).toContain('alt="a"')
	})

	test('複数の <img> が混在しても全て書換わる', () => {
		const html = '<img src="https://images.microcms-assets.io/assets/a.jpg" />' + '<p>text</p>' + '<img src="https://images.microcms-assets.io/assets/b.jpg" />'
		const urlMap = new Map([
			['https://images.microcms-assets.io/assets/a.jpg', 'http://pb.local/a.jpg'],
			['https://images.microcms-assets.io/assets/b.jpg', 'http://pb.local/b.jpg'],
		])

		const result = rewriteImageSrcs(html, urlMap)

		expect(result).toContain('http://pb.local/a.jpg')
		expect(result).toContain('http://pb.local/b.jpg')
		expect(result).not.toContain('images.microcms-assets.io')
	})

	test('urlMap に無い URL はそのまま残る', () => {
		const html = '<img src="https://other.example.com/x.png" />'
		const urlMap = new Map([['https://images.microcms-assets.io/assets/a.jpg', 'http://pb.local/a.jpg']])

		const result = rewriteImageSrcs(html, urlMap)

		expect(result).toContain('https://other.example.com/x.png')
	})

	test('他属性 (alt, width, loading) を持つ <img> でも壊れない', () => {
		const html = '<img alt="写真" width="800" height="600" loading="lazy" src="https://images.microcms-assets.io/assets/a.jpg" />'
		const urlMap = new Map([['https://images.microcms-assets.io/assets/a.jpg', 'http://pb.local/a.jpg']])

		const result = rewriteImageSrcs(html, urlMap)

		expect(result).toContain('src="http://pb.local/a.jpg"')
		expect(result).toContain('alt="写真"')
		expect(result).toContain('width="800"')
		expect(result).toContain('loading="lazy"')
	})

	test('空 HTML で例外を投げない', () => {
		expect(() => rewriteImageSrcs('', new Map())).not.toThrow()
		expect(rewriteImageSrcs('', new Map())).toBe('')
	})

	test('<img> を含まない HTML で例外を投げない', () => {
		const html = '<p>text only</p>'
		const result = rewriteImageSrcs(html, new Map())
		expect(result).toBe(html)
	})
})
