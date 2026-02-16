<script lang="ts">
	import type { Pathname } from "$app/types";

	import Daana from '$lib/assets/daanas_for_good-c.png';
	import Philo from '$lib/assets/philosophy_collective-c.png';
	import Sokubutsu from '$lib/assets/sokubutsu_daigaku-c.png';
	import Temple from '$lib/assets/temple-group-photo-c.jpg';
	import Card from '$lib/components/ui/works-card.svelte';


	type Work = {
		description: string;
		imageUrl?: string;
		isLabelReversed: boolean
		name: string;
		path?: Pathname | undefined;
		position: string;
		variant: "primary" | "secondary";
	};

	const works: Work[] = [
		{
			description: '簡単な説明分など簡単な説明分など簡単な説明分など',
			imageUrl: Temple,
			isLabelReversed: false,
			name: '実験寺院プロジェクト',
			path: '/temple',
			position: '',
			variant: 'primary',
		},
		{
			description: '簡単な説明分など簡単な説明分など簡単な説明分など',
			imageUrl: Philo,
			isLabelReversed: false,
			name: 'Philosophy Collectives Network',
			position: '',
			variant: 'secondary',
		},
		{
			description: '簡単な説明分など簡単な説明分など簡単な説明分など',
			imageUrl: Sokubutsu,
			isLabelReversed: true,
			name: '即仏大学',
			position: '',
			variant: 'primary'
		},
		{
			description: '簡単な説明分など簡単な説明分など簡単な説明分など',
			imageUrl: Daana,
			isLabelReversed: true,
			name: `DaNA's for Good`,
			position: '',
			variant: 'secondary'
		},
]

/**
 * Grid Area Helper
 * @param index 
 * @returns Area name
 */
function getGridArea(index: number) {
	return ['a', 'b', 'c', 'd'][index]
}
	
</script>

<div class="works-grid">
	{#each works as work, index (work.name)}
		<Card
			label={work.name}
			src={work.imageUrl}
			style={`grid-area: ${getGridArea(index)}`}
			variant={work.variant}
			isLabelReversed={work.isLabelReversed}
			path={work.path}
		/>
	{/each}
</div>

<style>
	.works-grid {
		display: flex;
		flex-direction: column;
		gap: 0;
		justify-items: center;
		margin-top: 1.5rem;
	}

	@media (width >= 768px) {
		.works-grid {
			display: grid;
			grid-template: 
				"a a a a a a b b b b b" 368px
				"c c c c c d d d d d d" 368px /
				1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
		}

		:global(.item1) {
			grid-area: a;
		}

		:global(.item2) {
			grid-area: b;
		}

		:global(.item3) {
			grid-area: c;
		}

		:global(.item4) {
			grid-area: d;
		}
	}
</style>