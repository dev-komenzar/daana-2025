<script lang="ts">
	import WorksOutreach from './works-outreach.svelte';
	import Works from './works.svelte';
</script>

<section id="works" class="container">
	<div class="wide-content">
		<h2 class="text-large heading">WORKS</h2>
	</div>

	<div class="full-content">
		<Works />
	</div>

	<div class="bg-second">
		<div class="wide-content">
			<h2 class="text-large heading two">WORKS</h2>
		</div>

		<div class="full-content">
			<WorksOutreach />
		</div>
	</div>
</section>

<style>
	.heading {
		font-family: var(--font-heading-bold);
		text-align: left;
	}

	.two {
		padding-top: 200px;
	}

	.bg-second {
		color: #FFF;
		background: #08192D;
	}
</style>