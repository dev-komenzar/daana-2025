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
			linkHref: {
				default: undefined,
				parseHTML: element => element.querySelector('a')?.getAttribute('href') ?? undefined,
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
						linkHref: element.querySelector('a')?.getAttribute('href') ?? undefined,
						src: img.getAttribute('src') ?? undefined,
					}
				},
				tag: 'figure',
			},
		]
	},

	renderHTML({ node }) {
		const attributes = node.attrs as { alt?: string; caption?: string; linkHref?: string; src?: string }
		const imgAttributes = mergeAttributes({ alt: attributes.alt ?? '', src: attributes.src ?? '' })
		const img = ['img', imgAttributes]
		const inner = attributes.linkHref ? ['a', { href: attributes.linkHref }, img] : img
		if (attributes.caption) {
			return ['figure', {}, inner, ['figcaption', {}, attributes.caption]]
		}
		return ['figure', {}, inner]
	},
})
