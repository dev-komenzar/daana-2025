<script lang="ts">
import NewsForm from '$lib/cms/news/news-form.svelte'
import { MetaTags } from 'svelte-meta-tags'

import type { ActionData, PageData } from './$types'

let { data, form }: { data: PageData; form?: ActionData } = $props()
</script>

<MetaTags title="お知らせ編集" />
<h1>お知らせ編集</h1>
<NewsForm
	mediaItems={data.mediaItems}
	submitLabel="更新"
	error={form?.error}
	initial={data.record}
	draftKey={`news:${data.record.id}`}
/>
