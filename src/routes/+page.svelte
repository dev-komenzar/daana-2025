<script lang="ts">
import OpeningLayer from '$lib/components/layout/opening-layer.svelte'
import HorizontalDivider from '$lib/components/ui/horizontal-divider.svelte'

import type { PageData } from './$types'

import SectionCompany from './section-company.svelte'
import SectionEyecatch from './section-eyecatch.svelte'
import SectionMission from './section-mission.svelte'
import SectionNews from './section-news.svelte'
import SectionTemple from './section-temple.svelte'
import SectionWorks from './section-works.svelte'

let { data }: { data: PageData } = $props()
</script>

<OpeningLayer />

<SectionEyecatch />

<SectionMission />

<SectionCompany />

<SectionTemple />

<HorizontalDivider marginTop={200} />

<SectionWorks />

<SectionNews
	newsItems={data.newsItems}
	pinnedNewsItems={data.pinnedNewsItems}
/>
