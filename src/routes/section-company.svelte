<!-- TODO: Delete members.svelte, members-card.svelte -->

<script lang="ts">
	import Directors from "$lib/components/ui/directors.svelte";
	import Staffs from "$lib/components/ui/staffs.svelte";
</script>

<section id="company" class="container">
	<div class="wide-content">
		<h2 class="text-large section-header">COMPANY</h2>
	</div>
	<div class="wide-content">
		<Directors />
	</div>
	<div class="wide-content staffs">
		<Staffs />
	</div>
</section>

<style>
	.staffs {
		margin: calc(95px * 2) auto 0;
	}
</style>
