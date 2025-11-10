<script lang="ts">
	import Logo from '$lib/assets/opening-logo.png';
	import { onMount } from "svelte";
	import { sineOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	let overlayVisible = $state(true);
	let contentVisible = $state(false);

	/*
	 * ウェルカムアニメーションの引数。
	 */
	interface WelcomeParameters {
		duration: number;
	}

	/**
	 * オープニングアニメーションを定義する。
	 * @see https://svelte.jp/tutorial/svelte/custom-css-transitions
	 */
	function welcome(node: Element, { duration }: WelcomeParameters) {
		return {
			css: (t: number) => `
				opacity: ${t};
				transform: scale(${sineOut(t) * 0.02 + 0.98});
			`,
			duration,
		}
	}

	onMount(() => {
		contentVisible = true;
		setTimeout(() => {
			contentVisible = false;
			overlayVisible = false;
		}, 2000);
	});
</script>

{#if overlayVisible}
	<div class="opening-layer" out:fade>
		{#if contentVisible}
			<!-- Add your opening layer content here -->
			<div in:welcome={{ duration: 800 }} >
				<img src={Logo} alt="Opening Logo" class='logo' />
			</div>
		{/if}
	</div>
{/if}

<style lang="css">
	.opening-layer {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
		display: grid;
		place-content: center;
		place-items: center;
		width: 100vw;
		height: 100lvh;
		background-color: white;
	}

	.logo {
		width: 100%;
		max-width: 440px;
	}
</style>
