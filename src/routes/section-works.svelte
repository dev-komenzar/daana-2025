<script lang="ts">
	import WorksOutreach from './works-outreach.svelte';
	import WorksCreation from './works.svelte';
</script>

<section id="works">
	<div class="container">
		<div class="wide-content">
			<h2 class="text-large heading">WORKS</h2>

			<h3>「創造」領域</h3>
			<p class="summary">いまに使える「仏教の価値」を創造する</p>
			<p class="works-body"><strong>当協会は、仏教哲学の探究と実践を通じ、現代社会に即した「仏教の価値」を創造しています。</strong></p>
			<ol>
				<li class="works-body"><strong>「実験寺院」の運営</strong>：「社会的意義を果たす仏教の再導入」をテーマに、寺院の新たな在り方を検証する実験の場を運営しています。</li>
				<li class="works-body"><strong>「Philosophy Collectives Network」の研究</strong>：仏教哲学に基づく組織論を構築し、現代の組織運営に活かすための実践的研究を展開しています。</li>
				<li class="works-body"><strong>「即仏大学」の運営</strong>：実験寺院グループが提唱する「即の仏教（時代と状況に即した仏教）」を体系的に学ぶための教育プラットフォームです。</li>
				<li class="works-body"><strong>「DaNAs for Good」の開催</strong>：「即の仏教」を概念で終わらせず、体感として落とし込むためのリトリート（合宿）企画を運営しています。</li>
			</ol>
			<p class="works-body">これらの活動を通じて「仏教の社会実装」を多角的に検証し、その知見を社会へ還元しています。</p>
		</div>

		<div class="full-content">
			<WorksCreation />
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

	h3{
		padding-top: 57px;
		font-family: var(--font-body-bold);
		font-size: 30px;
		line-height: normal;
		letter-spacing: 0.06em;
	}

	.summary{
		font-family: var(--font-body-bold);
		font-size: 15px;
		line-height: normal;
		letter-spacing: 0.06em;
	}

	.works-body{
		font-family: var(--font-body);
		font-size: 12px;
		line-height: 24px;
		letter-spacing: 0.06em;
	}

	.works-body > strong{
		font-family: var(--font-body-bold);
	}

	.summary + .works-body{
		padding-top: 32px;
	}

	ol{
		padding-inline-start: 1.4em;
	}
</style>