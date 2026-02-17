<script lang="ts">
import { SITE_FULL_URL } from '$lib/constants'
import { MetaTags } from 'svelte-meta-tags'

let { children } = $props()
</script>

<MetaTags
	title="松波龍源僧院長インタビュー"
	titleTemplate="%s | 日本仏教徒協会"
	canonical={`${SITE_FULL_URL}/interview-ryugen`}
/>

{@render children?.()}
