<!-- TODO: Delete members.svelte, members-card.svelte -->

<script lang="ts">
	import Directors from "./directors.svelte";
</script>

<section id="company" class="container">
	<div class="wide-content">
		<h2 class="text-large section-header">Company</h2>
		<h3 class="text-medium section-header-japanese">日本仏教徒協会_理事</h3>
	</div>
	<div class="wide-content">
		<Directors />
	</div>
</section>

<style>
	.text-left {
		text-align: left;
	}

	.section-header {
		font-family: var(--font-sans-medium);
		line-height: 44px;
		text-align: left;
	}

	.section-header-japanese {
		font-family: var(--font-gothic-bold);
		color: #3c87c0;
		text-align: left;
	}
</style>
