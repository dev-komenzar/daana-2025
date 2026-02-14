<script lang='ts'>
	import { SITE_FULL_URL } from '$lib/constants';
	import { MetaTags } from 'svelte-meta-tags';

	let { children } = $props();
</script>

<MetaTags
	title='実験寺院'
	titleTemplate='%s | 日本仏教徒協会'
	canonical={`${SITE_FULL_URL}/temple`}
/>

{@render children?.()}
