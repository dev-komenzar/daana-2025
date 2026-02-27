<script lang="ts">
import Bequest from './bequest.svelte'
import CreditCard from './credit-card.svelte'
import Projects from './projects.svelte'
import Tabs from './tabs.svelte'
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
</section>

{#snippet contents(tabId: string)}
	{#if tabId === 'basic'}
		<div class="tab-content-inner">
			<CreditCard />
		</div>
	{:else if tabId === 'project'}
		<div class="tab-content-inner">
			<Projects />
		</div>
	{:else if tabId === 'legacy'}
		<div class="tab-content-inner">
			<Bequest />
		</div>
	{/if}
{/snippet}

<style>
.container {
	padding-bottom: 200px;
	background-color: hsl(214deg 16% 91% / 58%);
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
	padding: 60px 4%;
	text-align: center;
	background-color: white;
}

@media screen and (width >= 768px) {
	.tab-content-inner {
		padding-top: 160px;
		padding-right: 45px;
		padding-left: 45px;
	}
}
</style>
