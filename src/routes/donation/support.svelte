<script lang="ts">
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
			<h3>クレジットカード、口座振替</h3>
			<p>日本仏教徒協会の活動にご参与頂ける方は、まずはこちらの「基本のご寄付」からご参加下さい。</p>
			<p>リンク先から「毎月の定額寄付」と「1回毎の寄付」がお選び頂けます。</p>
		</div>
	{:else if tabId === 'project'}
		<div class="tab-content-inner">
			<h3>プロジェクトへのご寄付</h3>
			<p>特定のプロジェクトへのご支援をお考えの方はこちらをご覧ください。</p>
		</div>
	{:else if tabId === 'legacy'}
		<div class="tab-content-inner">
			<h3>遺贈寄付など</h3>
			<p>遺贈寄付やその他の支援方法についてはこちらをご覧ください。</p>
		</div>
	{/if}
{/snippet}

<style>
.container {
	background-color: hsl(214 16% 91% / 58%);
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
	padding-top: 160px;
	padding-bottom: 60px;
}

.tab-content-inner h3 {
	font-family: var(--font-body-bold);
	font-size: 24px;
	line-height: 1.6;
	margin-bottom: 24px;
}

.tab-content-inner p {
	font-size: 14px;
	line-height: 1.8;
	color: #333;
}

.tab-content-inner p + p {
	margin-top: 12px;
}

@media screen and (width >= 768px) {
	.tab-content-inner h3 {
		font-size: 28px;
	}

	.tab-content-inner p {
		font-size: 16px;
	}
}
</style>
