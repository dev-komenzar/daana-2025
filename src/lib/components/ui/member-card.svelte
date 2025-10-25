<script lang="ts">
	type Properties = {
		label: string;
		position: string;
		src?: string;
		variant: "primary" | "secondary";
	};

	let { label, position, src, variant = "primary" }: Properties = $props();
</script>

<div class={["member-card", variant]}>

	{#if src}
		<img {src} alt={label} class="image" />
	{/if}

	<div class="description">
		<h3 class='label'>{label}</h3>
		<p class="position">{position}</p>
	</div>
</div>

<style>
	.member-card {
		position: relative;
		display: grid;
		place-items: end;
		width: 100%;
		max-width: 416px;
		aspect-ratio: 1 / 1;
		padding: 0;
		overflow: hidden;
		border-radius: 52px;
		transition: box-shadow 0.3s ease-in-out;
	}

	.member-card:hover {
		box-shadow: 0 8px 16px rgb(0 0 0 / 10%);
	}

	.primary {
		background-color: #dc6f41;
	}

	.secondary {
		background-color: #fcb89b;
	}

	.image {
		grid-area: 1 / 1;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease-in-out;
	}

	.member-card:hover .image {
		transform: scale(1.02);
	}

	.description {
		z-index: 1;
		grid-area: 1 / 1;
		width: min(278px, 100%);
		height: 78px;
		padding: 18px 36px;
		background-color: white;
		border-radius: 26px 0 0;
	}

	.label {
		margin: 0;
	}

	.position {
		margin: 0;
	}
</style>
