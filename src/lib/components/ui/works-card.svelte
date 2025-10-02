<script lang="ts">
	type Properties = {
		label: string;
		position: string;
		src?: string;
		style?: string;
		variant: "primary" | "secondary";
	};

	let { 
		label,
		position,
		src,
		style,
		variant = "primary",
	}: Properties = $props();
</script>

<div class={["works-card", variant]} style={style}>

	{#if src}
		<img {src} alt={label} class="image" />
	{/if}

	<div class="description">
		<h3 class='label'>{label}</h3>
		<p class="position">{position}</p>
	</div>
</div>

<style>
	.works-card {
		position: relative;
		width: 100%;
		height: 368px;
		padding: 0%;
		overflow: hidden;
		border-radius: 52px;
		transition: box-shadow 0.3s ease-in-out;
	}

	.works-card:hover {
		box-shadow: 0 8px 16px rgb(0 0 0 / 10%);
	}

	.primary {
		background-color: #566F8F;
	}

	.secondary {
		background-color: #A8BFDC;
	}

	.image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease-in-out;
	}

	.works-card:hover .image {
		transform: scale(1.02);
	}

	.description {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 278px;
		height: 78px;
		padding: 18px 36px;
		background-color: white;
		border-radius: 0 26px 0 0;
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
