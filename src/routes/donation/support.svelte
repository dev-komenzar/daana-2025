<script lang="ts">
import type { ProjectItem } from '$lib/projects'

import Bequest from './bequest.svelte'
import CreditCard from './credit-card.svelte'
import Projects from './projects.svelte'
import Tabs from './tabs.svelte'
import Wishlist from './wishlist.svelte'

let { projects }: { projects: ProjectItem[] } = $props()
</script>

{#snippet labelBasic()}基本の<wbr />ご寄付{/snippet}
{#snippet labelProject()}プロジェクト<br />へのご寄付{/snippet}
{#snippet labelLegacy()}遺贈寄付<wbr />など{/snippet}

<section class="container">
	<div class="wide-content">
		<h2>お気持ちにあった支援方法をお選びください</h2>

		<Tabs
			tabs={[
				{ color: 'orange' as const, id: 'basic', label: labelBasic },
				{ color: 'blue' as const, id: 'project', label: labelProject },
				{ color: 'mint' as const, id: 'legacy', label: labelLegacy },
			]}
			{contents}
		/>
	</div>

	<div class="wide-content wishlist">
		<Wishlist />
	</div>
</section>

{#snippet contents(tabId: string)}
	{#if tabId === 'basic'}
		<div class="tab-content-inner">
			<CreditCard />
		</div>
	{:else if tabId === 'project'}
		<div class="tab-content-inner">
			<Projects {projects} />
		</div>
	{:else if tabId === 'legacy'}
		<div class="tab-content-inner">
			<Bequest />
		</div>
	{/if}
{/snippet}

<style>
.container {
	background-color: hsl(214 16% 91% / 58%);
	padding-bottom: 200px;
}

h2 {
	font-size: 25px;
	line-height: 48px;
	letter-spacing: 0.12em;
}

.wide-content > h2 {
	padding-top: 200px;
	padding-bottom: 40px;
}

.tab-content-inner {
	text-align: center;
	background-color: white;
	padding-top: 60px;
	padding-bottom: 60px;
	padding-left: 4%;
	padding-right: 4%;
}

.wishlist {
	margin-top: 200px;
}

@media screen and (width >= 768px) {
	.tab-content-inner {
		padding-top: 160px;
		padding-left: 45px;
		padding-right: 45px;
	}
	.tab-content-inner h3 {
		font-size: 28px;
	}

	.tab-content-inner p {
		font-size: 16px;
	}
}
</style>
