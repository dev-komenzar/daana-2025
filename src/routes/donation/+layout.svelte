<script lang="ts">
import { SITE_FULL_URL } from '$lib/constants'
import { MetaTags } from 'svelte-meta-tags'

let { children } = $props()
</script>

<MetaTags
	title="寄付"
	titleTemplate="%s | 日本仏教徒協会"
	description="日本仏教徒協会への寄付ページ"
	canonical={`${SITE_FULL_URL}/donation`}
/>

{@render children?.()}
