<script lang="ts">
import { SITE_FULL_URL } from '$lib/constants'
import { MetaTags } from 'svelte-meta-tags'

let { children } = $props()
</script>

<MetaTags
	title="アクセス"
	titleTemplate="%s | 日本仏教徒協会"
	description="実験寺院寳幢寺（ほうどうじ）へのアクセス"
	canonical={`${SITE_FULL_URL}/access`}
/>

{@render children?.()}
