<script lang="ts">
	import { SITE_FULL_URL } from '$lib/constants';
	import { MetaTags } from 'svelte-meta-tags';

	let { children } = $props();
</script>

<MetaTags
	title="ページ移動中"
	titleTemplate="%s | 日本仏教徒協会"
	canonical={`${SITE_FULL_URL}/action`}
	robots="noindex, nofollow"
/>

{@render children?.()}
