<script lang="ts">
import type { PageData } from './$types'

import Intro from './intro.svelte'
import Support from './support.svelte'

let { data }: { data: PageData } = $props()
</script>

<Intro />
<Support projects={data.projects} />

<style>
</style>
