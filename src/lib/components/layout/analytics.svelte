<script lang="ts">
import { browser } from '$app/environment'
import { page } from '$app/stores'

const GA_MEASUREMENT_ID = 'G-VSDVQQFYRB'

$effect(() => {
	if (browser && typeof gtag === 'function') {
		gtag('config', GA_MEASUREMENT_ID, {
			page_path: $page.url.pathname,
		})
	}
})
</script>

<svelte:head>
	<!-- Google tag (gtag.js) -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"></script>`}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html `<script>
		globalThis.dataLayer = globalThis.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', '${GA_MEASUREMENT_ID}');
	</script>`}
</svelte:head>
