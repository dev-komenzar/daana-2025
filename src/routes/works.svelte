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
	
</script>

<div class="works-container">
	<div class="works-grid">
		{#each works as work (work.name)}
			<Card 
				label={work.name}
				position={work.position}
				src={work.imageUrl}
				variant={work.variant}
			/>
		{/each}
	</div>
</div>

<style>
	.works-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		justify-items: center;
		margin-top: 1.5rem;
	}

	@media (width >= 768px) {
		.works-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>