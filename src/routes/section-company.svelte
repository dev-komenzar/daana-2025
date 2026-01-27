<!-- TODO: Delete members.svelte, members-card.svelte -->

<script lang="ts">
	import Directors from "$lib/components/ui/directors.svelte";
	import HorizontalDivider from "$lib/components/ui/horizontal-divider.svelte";
	import Staffs from "$lib/components/ui/staffs.svelte";
</script>

<section id="company" class="container">
	<div class="wide-content">
		<h2 class="text-large section-header">COMPANY</h2>
	</div>
	<div class="wide-content">
		<Directors />
	</div>
	<HorizontalDivider marginTop={95} />
	<div class="wide-content staffs">
		<Staffs />
	</div>
	<HorizontalDivider marginTop={95} />
</section>

<style>
	.staffs {
		margin: 95px auto 0; /* CLAUDE.md原則: 下の要素にmargin-topを適用 */
	}
</style>
