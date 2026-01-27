<script lang="ts">
	import WorksOutreach from './works-outreach.svelte';
	import Works from './works.svelte';
</script>

<section id="works">
	<div class="container">
		<div class="wide-content">
			<h2 class="text-large heading">WORKS</h2>
		</div>

		<div class="full-content">
			<Works />
		</div>
	</div>

	<div class="container-bg-colored">
		<div class="">
			<div class="wide-content">
				<h2 class="text-large heading two">WORKS</h2>
			</div>

			<div class="full-content">
				<WorksOutreach />
			</div>
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
</style>