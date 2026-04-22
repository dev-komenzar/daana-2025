<script lang="ts">
import { resolve } from '$app/paths'
import { page } from '$app/state'
import { MetaTags } from 'svelte-meta-tags'

import type { LayoutServerData } from './$types'

import { shouldShowNav } from './nav-utilities'

type Properties = { children?: import('svelte').Snippet; data: LayoutServerData }
let { children, data }: Properties = $props()

const NAV_ITEMS = [
	{ label: 'お知らせ', path: '/cms/news' },
	{ label: 'プロジェクト', path: '/cms/projects' },
	{ label: 'メディア', path: '/cms/media' },
] as const

let showNav = $derived(shouldShowNav(page.url.pathname, data.user?.role))
</script>

<MetaTags
	title="CMS"
	titleTemplate="%s | CMS"
	robots="noindex, nofollow"
/>

{#if showNav}
	<div class="cms-shell">
		<aside
			class="cms-sidenav"
			aria-label="CMS navigation"
		>
			<nav>
				<ul>
					{#each NAV_ITEMS as item (item.path)}
						<li>
							<a
								href={resolve(item.path)}
								aria-current={page.url.pathname.startsWith(item.path) ? 'page' : undefined}>{item.label}</a
							>
						</li>
					{/each}
				</ul>
			</nav>
			<form
				method="POST"
				action="/cms/logout"
				class="cms-logout"
			>
				<button type="submit">ログアウト</button>
			</form>
		</aside>
		<main class="cms-main">
			{@render children?.()}
		</main>
	</div>
{:else}
	{@render children?.()}
{/if}

<style>
.cms-shell {
	display: flex;
	gap: 24px;
	padding: 24px;
}

.cms-sidenav {
	display: flex;
	flex-direction: column;
	flex-shrink: 0;
	justify-content: space-between;
	width: 200px;
	min-height: 60vh;
}

.cms-sidenav ul {
	padding: 0;
	margin: 0;
	list-style: none;
}

.cms-sidenav li + li {
	margin-top: 8px;
}

.cms-sidenav a {
	display: block;
	padding: 8px 12px;
	color: var(--color-text, #16212f);
	text-decoration: none;
	border-radius: 4px;
}

.cms-sidenav a[aria-current='page'] {
	background: var(--color-secondary, #a8bfdc);
}

.cms-logout button {
	padding: 8px 12px;
	color: var(--color-text, #16212f);
	cursor: pointer;
	background: transparent;
	border: 1px solid #ccc;
	border-radius: 4px;
}

.cms-main {
	flex: 1;
	min-width: 0;
}
</style>
