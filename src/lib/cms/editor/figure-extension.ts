import { mergeAttributes, Node } from '@tiptap/core'

export const FigureExtension = Node.create({
	addAttributes() {
		return {
			alt: {
				default: undefined,
				parseHTML: element => element.querySelector('img')?.getAttribute('alt') ?? undefined,
				renderHTML: () => ({}),
			},
			caption: {
				default: undefined,
				parseHTML: element => element.querySelector('figcaption')?.textContent ?? undefined,
				renderHTML: () => ({}),
			},
			src: {
				default: undefined,
				parseHTML: element => element.querySelector('img')?.getAttribute('src') ?? undefined,
				renderHTML: () => ({}),
			},
		}
	},
	atom: true,
	group: 'block',
	inline: false,

	name: 'figure',

	parseHTML() {
		return [
			{
				getAttrs: element => {
					if (typeof element === 'string') return false
					const img = element.querySelector('img')
					if (!img) return false
					return {
						alt: img.getAttribute('alt') ?? undefined,
						caption: element.querySelector('figcaption')?.textContent ?? undefined,
						src: img.getAttribute('src') ?? undefined,
					}
				},
				tag: 'figure',
			},
		]
	},

	renderHTML({ HTMLAttributes }) {
		const { alt, caption, src } = HTMLAttributes as { alt?: string; caption?: string; src?: string }
		const imgAttributes = mergeAttributes({ alt: alt ?? '', src: src ?? '' })
		if (caption) {
			return ['figure', {}, ['img', imgAttributes], ['figcaption', {}, caption]]
		}
		return ['figure', {}, ['img', imgAttributes]]
	},
})
