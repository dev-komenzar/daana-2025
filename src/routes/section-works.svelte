<script lang="ts">
	import Works from './works.svelte';
</script>

<section id="works">
	<div class="container content">
		<h2 class="text-large">Works</h2>
		<p>
			いつ頃より発足し、どのような陣営で組織・運営が行われているか。海は昼眠る、夜も眠る、ごうごう、いびきをかいて眠る。昔、昔、おお昔、海がはじめて、口開けて、笑ったときに、太陽は、目をまわして驚いた。かわいい花や、人たちを、海がのんでしまおうと、やさしく光る太陽は、魔術で、海を眠らした。海は昼眠る、夜も眠る。ごうごう、いびきをかいて眠る。
		</p>
	</div>

	<Works />
</section>

<style>
	.content {
		width: 92%;
		max-width: 540px;
	}

	@media screen and (width >= 768px) {
		.content {
			width: 100%;
			max-width: 540px;
		}
	}
</style>