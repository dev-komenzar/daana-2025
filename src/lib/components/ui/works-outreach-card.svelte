<script lang="ts">
	type Properties = {
		description: string;
		isLabelReversed?: boolean;
		label: string;
		src?: string;
		style?: string;
		variant: "primary" | "secondary";
	};

	let {
		description,
		isLabelReversed = false,
		label,
		src,
		style,
		variant = "primary",
	}: Properties = $props();
</script>

<div class={["works-card", variant]} style={style}>

	{#if src}
		<img {src} alt={label} class="image" />
	{/if}

	<div class={["label-box", isLabelReversed && "reversed"]}>
		<h3 class="label">{label}</h3>
		<p class="description">{description}</p>
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

		@media (width >= 768px) {
			.works-card {
				border-radius: 0;
			}
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

	.label-box {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 335px;
		height: 51px;
		padding: 10px 0 10px 30px;
		background-color: #08192D;
		border-radius: 0 26px 0 0;
	}

	.label-box.reversed {
		right: 0;
		left: auto;
		padding: 10px 30px 10px 0;
		text-align: right;
		border-radius: 26px 0 0;
	}

	.label {
		margin: 0;
		font-family: var(--font-heading-bold);
		font-size: 14px;
		line-height: 20px;
		letter-spacing: -0.01em;
	}

	.description {
		font-family: var(--font-heading);
		font-size: 8px;
		line-height: 10px;
		letter-spacing: 0.06em;
	}

	.label + .description {
		margin-top: 6px;
	}
</style>
