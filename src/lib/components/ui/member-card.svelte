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
		width: 100%;
		max-width: 416px;
		aspect-ratio: 1 / 1;
		padding: 0%;
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
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease-in-out;
	}

	.member-card:hover .image {
		transform: scale(1.02);
	}

	.description {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 278px;
		height: 78px;
		padding: 18px 36px;
		background-color: white;
		border-radius: 26px 0 0;
	}

	.label {
		margin: 0;
	}

	.position {
		position: absolute;
		bottom: 0;
		margin: 0;
	}
</style>
