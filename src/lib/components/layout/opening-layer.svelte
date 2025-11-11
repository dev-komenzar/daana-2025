<script lang="ts">
	import Logo from '$lib/assets/opening-logo.png';
	import { onMount } from "svelte";

	let animationPhase = $state<'hidden' | 'hiding' | 'initial' | 'showing'>('initial');

	onMount(() => {
		// Start showing the logo
		requestAnimationFrame(() => {
			animationPhase = 'showing';
		});

		// Start hiding after 2 seconds
		setTimeout(() => {
			animationPhase = 'hiding';
		}, 2000);

		// Complete animation after fade out
		setTimeout(() => {
			animationPhase = 'hidden';
		}, 2800); // 2000ms + 800ms fade duration
	});
</script>

<div class="opening-layer" class:hiding={animationPhase === 'hiding'} class:hidden={animationPhase === 'hidden'}>
	<div class="logo-wrapper" class:showing={animationPhase === 'showing'}>
		<img src={Logo} alt="Opening Logo" class='logo' />
	</div>
</div>

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
		pointer-events: all;
		background-color: white;
		opacity: 1;
		transition: opacity 800ms ease-out;
	}

	.opening-layer.hiding {
		opacity: 0;
	}

	.opening-layer.hidden {
		visibility: hidden;
		pointer-events: none;
		opacity: 0;
	}

	.logo-wrapper {
		opacity: 0;
		transform: scale(0.98);
		transition:
			opacity 800ms ease-out,
			transform 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94); /* sineOut easing */
	}

	.logo-wrapper.showing {
		opacity: 1;
		transform: scale(1);
	}

	.logo {
		width: 100%;
		max-width: 440px;
	}
</style>
