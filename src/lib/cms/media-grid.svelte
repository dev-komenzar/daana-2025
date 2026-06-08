<script lang="ts">
export type MediaItem = { alt: string; id: string; thumbUrl: string }

type Properties = {
	class?: string
	items: MediaItem[]
	onloadmore?: (() => Promise<void>) | undefined
	onselect: (item: MediaItem) => void
	selectedId?: string | undefined
}

let { class: className = '', items, onloadmore, onselect, selectedId }: Properties = $props()

let sentinel = $state<HTMLLIElement | undefined>()
let loading = $state(false)

$effect(() => {
	if (!onloadmore || !sentinel) return

	const observer = new IntersectionObserver(
		async ([entry]) => {
			if (entry?.isIntersecting && !loading) {
				loading = true
				await onloadmore()
				loading = false
			}
		},
		{ rootMargin: '200px' },
	)

	observer.observe(sentinel)

	return () => observer.disconnect()
})
</script>

<ul class="media-grid {className}">
	{#each items as item (item.id)}
		<li>
			<button
				type="button"
				class={selectedId === item.id ? 'selected' : ''}
				onclick={() => onselect(item)}
			>
				<img
					src={item.thumbUrl}
					alt={item.alt}
				/>
				<span class="alt">{item.alt}</span>
			</button>
		</li>
	{/each}
	{#if onloadmore}
		<li
			bind:this={sentinel}
			class="sentinel"
			aria-hidden="true"
		></li>
	{/if}
</ul>

{#if loading}
	<p
		class="loading"
		role="status"
		aria-label="読み込み中"
	>
		読み込み中...
	</p>
{/if}

<style>
.media-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
	gap: 8px;
	padding: 0;
	list-style: none;
}

.media-grid li {
	margin: 0;
}

.media-grid button {
	display: flex;
	flex-direction: column;
	gap: 4px;
	width: 100%;
	padding: 4px;
	cursor: pointer;
	background: transparent;
	border: 1px solid transparent;
	border-radius: 4px;
}

.media-grid button:hover {
	border-color: var(--color-primary, #08192d);
}

.media-grid button.selected {
	background: color-mix(in srgb, var(--color-primary, #08192d) 10%, transparent);
	border-color: var(--color-primary, #08192d);
}

.media-grid img {
	width: 100%;
	height: auto;
	aspect-ratio: 1;
	object-fit: cover;
}

.alt {
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 11px;
	white-space: nowrap;
}

.sentinel {
	height: 1px;
}

.loading {
	padding: 12px 0;
	font-size: 13px;
	color: #666;
	text-align: center;
}
</style>
