<script lang="ts">
	import type { Pathname } from "$app/types";

	import { floatUp } from '$lib/actions';


	type Properties = {
		description: string;
		isLabelReversed?: boolean;
		label: string;
		path: Pathname | undefined;
		src?: string;
		style?: string;
		variant: "primary" | "secondary";
	};

	let {
		description,
		isLabelReversed = false,
		label,
		path,
		src,
		style,
		variant = "primary"
	}: Properties = $props();
</script>

<svelte:element this={path ? "a" : "div"} href={path} class={["works-card", variant]} style={style} use:floatUp>

	{#if src}
		<img {src} alt={label} class="image" />
	{/if}

	<div class={["label-box", isLabelReversed && "reversed"]}>
		<h3 class="label">{label}</h3>
		<p class="description">{description}</p>
	</div>
</svelte:element>

<style>
	.works-card {
		position: relative;
		width: 100%;
		height: 368px;
		padding: 0%;
		overflow: hidden;
		transition: box-shadow 0.3s ease-in-out;
	}

	.works-card:hover {
		box-shadow: 0 8px 16px rgb(0 0 0 / 10%);
	}

	a.works-card {
		display: block;
		color: inherit;
		text-decoration: none;
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
		background-color: white;
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

	a.works-card .label {
		position: relative;
		display: inline-block;
	}

	a.works-card .label::after {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 1px;
		content: "";
		background-color: currentcolor;
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.3s ease-in-out;
	}

	a.works-card:hover .label::after {
		transform: scaleX(1);
	}
</style>
