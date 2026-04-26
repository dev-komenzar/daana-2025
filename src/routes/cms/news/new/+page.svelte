<script lang="ts">
import NewsForm from '$lib/cms/news/news-form.svelte'
import { MetaTags } from 'svelte-meta-tags'

import type { ActionData, PageData } from './$types'

let { data, form }: { data: PageData; form?: ActionData } = $props()
</script>

<MetaTags title="お知らせ新規作成" />
<h1>お知らせ新規作成</h1>
<NewsForm
	mediaItems={data.mediaItems}
	submitLabel="作成"
	error={form?.error}
	draftKey="news:new"
/>
