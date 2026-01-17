<script lang="ts">
	import { resolve } from '$app/paths';
	import Button from '$lib/assets/donation-button.png';
	import EnhancedImage from '$lib/components/ui/enhanced-image.svelte';
</script>

<section id="donation" class="container">
	<div class="content">
		<h2 class="text-large font-gothic-bold">DONATE</h2>
		<p>豊かで、巡りのよい、循環型の社会を創る為に、まず「寄付」と言うアクションを。
あなたの力が我々の動力です。
	</p>
	</div>
	<a href={resolve('/donation')} class="donation-link">
		<EnhancedImage src={Button} alt="寄付ボタン" class="donation-button" />
	</a>
</section>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.donation-button {
		width: 304px;
		height: 127px;
	}
</style>