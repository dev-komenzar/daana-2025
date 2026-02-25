<script lang="ts">
import type { Snippet } from 'svelte'

interface Tab {
	color: 'blue' | 'mint' | 'orange'
	id: string
	label: string
}

interface Properties {
	activeTab?: string
	contents: Snippet<[string]>
	tabs: Tab[]
}

let { tabs, activeTab = $bindable(tabs[0]?.id), contents }: Properties = $props()

function selectTab(id: string) {
	activeTab = id
}

function handleKeydown(event: KeyboardEvent, index: number) {
	let newIndex = index
	switch (event.key) {
		case 'ArrowLeft': {
			newIndex = (index - 1 + tabs.length) % tabs.length

			break
		}
		case 'ArrowRight': {
			newIndex = (index + 1) % tabs.length

			break
		}
		case 'End': {
			newIndex = tabs.length - 1

			break
		}
		case 'Home': {
			newIndex = 0

			break
		}
		default: {
			return
		}
	}
	event.preventDefault()
	activeTab = tabs[newIndex].id
	const tabElements = document.querySelectorAll<HTMLButtonElement>('[role="tab"]')
	tabElements[newIndex]?.focus()
}
</script>

<div class="tabs-container">
	<div
		class="tab-list"
		role="tablist"
	>
		{#each tabs as tab, index (tab.id)}
			<button
				role="tab"
				id="tab-{tab.id}"
				aria-selected={activeTab === tab.id}
				aria-controls="tabpanel-{tab.id}"
				tabindex={activeTab === tab.id ? 0 : -1}
				class="tab"
				class:active={activeTab === tab.id}
				data-color={tab.color}
				onclick={() => selectTab(tab.id)}
				onkeydown={event => handleKeydown(event, index)}
			>
				<span class="tab-bar"></span>
				<span class="tab-content">
					<span class="tab-icon">
						{#if activeTab === tab.id}
							<!-- Filled checkbox with check -->
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
							>
								<rect
									x="3"
									y="3"
									width="18"
									height="18"
									rx="2"
									fill="currentColor"
								/>
								<path
									d="M9 12l2 2 4-4"
									stroke="white"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						{:else}
							<!-- Empty checkbox -->
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
							>
								<rect
									x="3"
									y="3"
									width="18"
									height="18"
									rx="2"
									stroke="currentColor"
									stroke-width="2"
								/>
							</svg>
						{/if}
					</span>
					<span class="tab-label">{tab.label}</span>
				</span>
			</button>
		{/each}
	</div>

	{#each tabs as tab (tab.id)}
		<div
			role="tabpanel"
			id="tabpanel-{tab.id}"
			aria-labelledby="tab-{tab.id}"
			class="tab-panel"
			hidden={activeTab !== tab.id}
		>
			{@render contents(tab.id)}
		</div>
	{/each}
</div>

<style>
.tabs-container {
	width: 100%;
}

.tab-list {
	display: flex;
	gap: 0;
}

.tab {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0;
	background: #fff;
	border: none;
	cursor: pointer;
	position: relative;
	transition:
		background 0.2s ease,
		color 0.2s ease;
}

.tab + .tab {
	margin-left: 6px;
}

.tab-bar {
	display: block;
	width: 100%;
	height: 6px;
	transition: background 0.2s ease;
}

.tab[data-color='orange'] .tab-bar {
	background: var(--color-accent);
}

.tab[data-color='blue'] .tab-bar {
	background: var(--color-accent-blue);
}

.tab[data-color='mint'] .tab-bar {
	background: var(--color-accent-mint);
}

/* Color variations */
.tab[data-color='orange'] {
	--tab-color: var(--color-accent);
}

.tab[data-color='blue'] {
	--tab-color: var(--color-accent-blue);
}

.tab[data-color='mint'] {
	--tab-color: var(--color-accent-mint);
}

.tab.active[data-color='orange'],
.tab:hover[data-color='orange'] {
	color: var(--color-accent);
}

.tab.active[data-color='blue'],
.tab:hover[data-color='blue'] {
	color: var(--color-accent-blue);
}

.tab.active[data-color='mint'],
.tab:hover[data-color='mint'] {
	color: var(--color-accent-mint);
}

.tab:not(.active) {
	background: #e8e8e8;
}

.tab:not(.active):not(:hover) {
	color: #999;
}

.tab-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	padding: 16px 8px;
}

.tab-icon {
	display: flex;
	align-items: center;
	justify-content: center;
}

.tab-icon svg {
	width: 24px;
	height: 24px;
}

.tab-label {
	font-family: var(--font-body-medium);
	font-size: 14px;
	line-height: 1.4;
	text-align: center;
	white-space: nowrap;
	color: #000;
}

@media screen and (width >= 768px) {
	.tab-content {
		flex-direction: row;
		gap: 12px;
		padding: 20px 16px;
	}

	.tab-label {
		font-size: 16px;
	}

	.tab-icon svg {
		width: 28px;
		height: 28px;
	}
}

/* Tab panel */
.tab-panel {
	padding: 6px 0;
}

.tab-panel[hidden] {
	display: none;
}

/* Focus styles for accessibility */
.tab:focus-visible {
	outline: 2px solid var(--tab-color);
	outline-offset: -2px;
}
</style>
