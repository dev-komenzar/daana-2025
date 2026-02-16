<script lang="ts">
	import CorporateTraining from '$lib/assets/corporate_training-c.jpg';
	import ExecutiveDialogue from '$lib/assets/executive_dialogue-c.jpg';
	import MunicipalPartnership from '$lib/assets/municipal_partnership-c.jpg';
	import PublicLectures from '$lib/assets/public_lectures-c.jpg';
	import Card from '$lib/components/ui/works-outreach-card.svelte';

	type Work = {
		description?: string;
		imageUrl?: string;
		isLabelReversed: boolean
		name: string;
		position: string;
		variant: "primary" | "secondary";
	};

	const works: Work[] = [
		{
			description: '簡単な説明分など簡単な説明分など簡単な説明分など',
			imageUrl: CorporateTraining,
			isLabelReversed: false,
			name: '企業向け研修事業',
			position: '',
			variant: 'primary',
		},
		{
			description: '簡単な説明分など簡単な説明分など簡単な説明分など',
			imageUrl: ExecutiveDialogue,
			isLabelReversed: false,
			name: '経営層向け哲学対話',
			position: '',
			variant: 'secondary',
		},
		{
			description: '簡単な説明分など簡単な説明分など簡単な説明分など',
			imageUrl: PublicLectures,
			isLabelReversed: true,
			name: '各種講演・講座',
			position: '',
			variant: 'primary'
		},
		{
			description: '簡単な説明分など簡単な説明分など簡単な説明分など',
			imageUrl: MunicipalPartnership,
			isLabelReversed: true,
			name: `地方行政連携事業`,
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