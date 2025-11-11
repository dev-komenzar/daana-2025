<script lang="ts">
	import { SITE_FULL_URL } from '$lib/constants';
	import { MetaTags } from 'svelte-meta-tags';

	let { children } = $props();
</script>


<MetaTags
	title='お知らせ一覧'
	titleTemplate='%s | 実験寺院 寳幢寺'
	canonical={`${SITE_FULL_URL}/news`}
/>

{@render children?.()}