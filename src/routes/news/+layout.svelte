<script lang="ts">
import { SITE_FULL_URL } from '$lib/constants'
import { MetaTags } from 'svelte-meta-tags'

let { children } = $props()
</script>

<MetaTags
	title="お知らせ一覧"
	titleTemplate="%s | 日本仏教徒協会"
	canonical={`${SITE_FULL_URL}/news`}
/>

{@render children?.()}
