<script lang="ts">
import type { Editor } from '@tiptap/core'

import { FloatingMenuPlugin } from '@tiptap/extension-floating-menu'
import { onDestroy, onMount } from 'svelte'

type MenuItem = {
	action: (editor: Editor) => void
	label: string
}

type Properties = { editor: Editor }

let { editor }: Properties = $props()

let menuElement: HTMLDivElement | undefined = $state()
let visible = $state(false)
let activeIndex = $state(0)

const menuItems: MenuItem[] = [
	{
		action: editor_ => {
			const anchor = editor_.state.selection.anchor
			const resolvedPos = editor_.state.doc.resolve(anchor)
			editor_.chain().focus().deleteRange({ from: resolvedPos.start(), to: anchor }).toggleHeading({ level: 2 }).run()
		},
		label: 'Heading 2',
	},
	{
		action: editor_ => {
			const anchor = editor_.state.selection.anchor
			const resolvedPos = editor_.state.doc.resolve(anchor)
			editor_.chain().focus().deleteRange({ from: resolvedPos.start(), to: anchor }).toggleHeading({ level: 3 }).run()
		},
		label: 'Heading 3',
	},
	{
		action: editor_ => {
			const anchor = editor_.state.selection.anchor
			const resolvedPos = editor_.state.doc.resolve(anchor)
			editor_.chain().focus().deleteRange({ from: resolvedPos.start(), to: anchor }).toggleBulletList().run()
		},
		label: 'Bullet List',
	},
	{
		action: editor_ => {
			const anchor = editor_.state.selection.anchor
			const resolvedPos = editor_.state.doc.resolve(anchor)
			editor_.chain().focus().deleteRange({ from: resolvedPos.start(), to: anchor }).toggleOrderedList().run()
		},
		label: 'Ordered List',
	},
	{
		action: editor_ => {
			const anchor = editor_.state.selection.anchor
			const resolvedPos = editor_.state.doc.resolve(anchor)
			editor_.chain().focus().deleteRange({ from: resolvedPos.start(), to: anchor }).toggleBlockquote().run()
		},
		label: 'Blockquote',
	},
]

function selectItem(item: MenuItem) {
	item.action(editor)
	visible = false
	activeIndex = 0
}

function handleKeydown(event: KeyboardEvent) {
	if (!visible) return
	switch (event.key) {
		case 'ArrowDown': {
			event.preventDefault()
			activeIndex = (activeIndex + 1) % menuItems.length

			break
		}
		case 'ArrowUp': {
			event.preventDefault()
			activeIndex = (activeIndex - 1 + menuItems.length) % menuItems.length

			break
		}
		case 'Enter': {
			event.preventDefault()
			selectItem(menuItems[activeIndex])

			break
		}
		case 'Escape': {
			visible = false
			activeIndex = 0

			break
		}
		// No default
	}
}

onMount(() => {
	if (!menuElement) return

	const plugin = FloatingMenuPlugin({
		editor,
		element: menuElement,
		options: {
			offset: 4,
			placement: 'bottom-start',
		},
		pluginKey: 'slashMenu',
		shouldShow: ({ state }) => {
			const sel = state.selection
			const lineText = sel.$from.parent.textContent
			return lineText === '/'
		},
	})

	editor.registerPlugin(plugin)

	editor.on('transaction', ({ editor: instance }) => {
		const sel = instance.state.selection
		const lineText = sel.$from.parent.textContent
		if (lineText === '/') {
			visible = true
			activeIndex = 0
		} else {
			visible = false
			activeIndex = 0
		}
	})

	document.addEventListener('keydown', handleKeydown, true)
})

onDestroy(() => {
	editor.unregisterPlugin('slashMenu')
	document.removeEventListener('keydown', handleKeydown, true)
})
</script>

<div
	bind:this={menuElement}
	class="slash-menu"
	class:is-visible={visible}
	role="listbox"
	aria-label="Block type"
>
	{#each menuItems as item, index (item.label)}
		<button
			type="button"
			role="option"
			aria-selected={index === activeIndex}
			class:is-active={index === activeIndex}
			onclick={() => selectItem(item)}
			onmouseenter={() => {
				activeIndex = index
			}}>{item.label}</button
		>
	{/each}
</div>

<style>
.slash-menu {
	display: none;
	flex-direction: column;
	min-width: 160px;
	padding: 4px;
	background: #fff;
	border: 1px solid #ccc;
	border-radius: 4px;
	box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
}

.slash-menu.is-visible {
	display: flex;
}

button {
	padding: 6px 10px;
	font-size: 13px;
	text-align: left;
	cursor: pointer;
	background: none;
	border: none;
	border-radius: 3px;
}

button.is-active {
	background: #f0f0f0;
}
</style>
