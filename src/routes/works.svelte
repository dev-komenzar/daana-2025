<script lang="ts">
	import Card from '$lib/components/ui/works-card.svelte';

	type Work = {
		description: string;
		imageUrl?: string;
		name: string;
		position: string;
		variant: "primary" | "secondary";
	};

	const works: Work[] = [
		{
			description: '',
			imageUrl: '',
			name: 'sample1',
			position: '',
			variant: 'primary',
		},
		{
			description: '',
			imageUrl: '',
			name: 'sample2',
			position: '',
			variant: 'secondary',
		},
		{
			description: '',
			imageUrl: '',
			name: 'sample3',
			position: '',
			variant: 'primary',
		},
		{
			description: '',
			imageUrl: '',
			name: 'sample4',
			position: '',
			variant: 'secondary',
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
			position={work.position}
			src={work.imageUrl}
			style={`grid-area: ${getGridArea(index)}`}
			variant={work.variant}
		/>
	{/each}
</div>

<style>
	.works-grid {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
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
			gap: 0;
		}

		.item1 {
			grid-area: a;
		}

		.item2 {
			grid-area: b;
		}

		.item3 {
			grid-area: c;
		}

		.item4 {
			grid-area: d;
		}
	}
</style>