<script lang="ts">
import ProjectsForm from '$lib/cms/projects/projects-form.svelte'
import { MetaTags } from 'svelte-meta-tags'

import type { ActionData, PageData } from './$types'

let { data, form }: { data: PageData; form?: ActionData } = $props()
</script>

<MetaTags title="プロジェクト新規作成" />
<h1>プロジェクト新規作成</h1>
<ProjectsForm
	mediaItems={data.mediaItems}
	submitLabel="作成"
	error={form?.error}
/>
