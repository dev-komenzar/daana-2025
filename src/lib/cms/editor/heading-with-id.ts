import { mergeAttributes, Node, textblockTypeInputRule } from '@tiptap/core'

interface HeadingWithIdOptions {
	HTMLAttributes: Record<string, unknown>
	levels: Level[]
}

type Level = 1 | 2 | 3 | 4 | 5 | 6

function djb2Hash(text: string): string {
	let hash = 5381
	for (let index = 0; index < text.length; index++) {
		hash = ((hash << 5) + hash) ^ (text.codePointAt(index) ?? 0)
		hash = hash >>> 0
	}
	return hash.toString(16).padStart(7, '0').slice(-7)
}

export const HeadingWithId = Node.create<HeadingWithIdOptions>({
	addAttributes() {
		return {
			id: {
				default: undefined,
				parseHTML: (element: Element) => element.getAttribute('id') ?? undefined,
				renderHTML: () => ({}),
			},
			level: {
				default: 1,
				rendered: false,
			},
		}
	},

	addCommands() {
		return {
			setHeading:
				(attributes: { level: Level }) =>
				({ commands }) => {
					if (!this.options.levels.includes(attributes.level)) return false
					return commands.setNode(this.name, attributes)
				},
			toggleHeading:
				(attributes: { level: Level }) =>
				({ commands }) => {
					if (!this.options.levels.includes(attributes.level)) return false
					return commands.toggleNode(this.name, 'paragraph', attributes)
				},
		}
	},

	addInputRules() {
		return this.options.levels.map((level: Level) =>
			textblockTypeInputRule({
				find: new RegExp(`^(#{1,${level}})\\s$`),
				getAttributes: { level },
				type: this.type,
			}),
		)
	},
	addKeyboardShortcuts() {
		return Object.fromEntries(this.options.levels.map(level => [`Mod-Alt-${level}`, () => this.editor.commands.toggleHeading({ level })]))
	},
	addOptions() {
		return {
			HTMLAttributes: {},
			levels: [1, 2, 3, 4, 5, 6],
		}
	},

	content: 'inline*',

	defining: true,

	group: 'block',

	name: 'heading',

	parseHTML() {
		return this.options.levels.map((level: Level) => ({
			attrs: { level },
			tag: `h${level}`,
		}))
	},

	renderHTML({ HTMLAttributes, node }) {
		const hasLevel = this.options.levels.includes(node.attrs.level as Level)
		const level = hasLevel ? (node.attrs.level as number) : this.options.levels[0]
		const text = node.textContent
		const id = `h${djb2Hash(text)}`
		return [`h${level}`, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { id }), 0]
	},
})
