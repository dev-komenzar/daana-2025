<script lang="ts">
import { page } from '$app/state'
import { MetaTags } from 'svelte-meta-tags'
</script>

<MetaTags title="お知らせ編集" />

<h1>お知らせ編集</h1>
<p>ID: {page.params.id}</p>
<p>Coming soon</p>
