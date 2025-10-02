<script lang="ts">
	import { resolve } from '$app/paths';
	import Button from '$lib/assets/donation-button.png';
</script>

<section id="donation" class="container">
	<div class="content">
		<h2 class="text-large">DONATE</h2>
		<p>豊かで、巡りのよい、循環型の社会を創る為に、まず「寄付」と言うアクションを。
あなたの力が我々の動力です。
	</p>
	</div>
	<a href={resolve('/donation')} class="donation-link">
		<img src={Button} alt="寄付ボタン">
	</a>
</section>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	img {
		width: 304px;
		height: 127px;
	}
</style>