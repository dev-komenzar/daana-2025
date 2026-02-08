<script lang="ts">
	import Photo from '$lib/assets/interview/ryugen-c.jpg';
	import EnhancedImage from '$lib/components/ui/enhanced-image.svelte';

	const p = {
		bio: `
大阪外国語大学（現：大阪大学）外国語学部卒、同大大学院東南アジア・オセアニア地域言語社会研究科博士前期課程修了、修士(学術)。ミャンマー仏教の文化人類学的研究を行う中で、研究より実践に惹かれ仏教者として生きることを志す。当初日本仏教界に縁がなく、武術の指導者として世に向かおうとするも2010年に縁を得て出家・修行（真言律宗総本山西大寺）。伝統や学術を大切にしつつも、囚われない「今に活きる仏教思想」の社会実装を提唱し、実験寺院の概念と方法論を創案。日本仏教徒協会設立の礎となる。
多くの起業家、経営者、医師や学生などの精神的指導者として信頼を寄せられている。
`,
		imageUrl: Photo,
		name: "松波龍源",
		nameRomaji: "Ryugen Matsunami",
		positions: [
			"日本仏教徒協会 最高顧問 / Principal Advisor, Japan Buddhist Association",
			"実験寺院グループ 総監    / Master of the Order , Experimental Buddhism Order",
			"実験寺院 寳幢寺 僧院長 / Temple Master , Hōdō-ji Temple",
		],
	};
</script>

<section class="container">
	<div class="wide-content">
		<h2 class="pre-heading">実験寺院の取り組みについて、<br/>実験寺院グループ総監にインタビューしてみました。</h2>
	</div>
	<div class="full-content put-image-right">
		<div class="description">
			<h1 class='name'>{p.name}</h1>
			<p class="name-romaji">{p.nameRomaji}</p>
			{#each p.positions as position (position)}
				<p class="position" >{position}</p>
			{/each}
			<p class="bio">{p.bio}</p>
		</div>

		<div class="image-wrapper-first">
			<EnhancedImage src={p.imageUrl} alt={p.name}/>
		</div>
	</div>
</section>

<style>

	.pre-heading {
		/* 実験寺院の取り組みについて、 実験寺院グループ総監にインタビューしてみました。 */

		font-family: var(--font-heading-bold);
		font-size: 16px;
		line-height: 30px;
		color: #000;
		letter-spacing: 0.12em;
	}

	h1 {
		margin-bottom: 24px;
		font-family: 'Noto Sans JP Medium', sans-serif;
		font-size: 24px;
	}

	.description {
		width: 100%;
		font-family: var(--font-body-bold);
		text-align: left;
	}

	.name {
		/* 松波龍源 */
		margin: 13px auto 0;
		font-family: var(--font-body-bold);
		font-size: 25px;
		line-height: 36px;
		color: #000;
		letter-spacing: 0.12em;
	}

	.name-romaji {
		/* Matsunami Ryugen */
		font-family: var(--font-body-bold);
		font-size: 13px;
		line-height: 16px;
		color: #000;
		letter-spacing: 0.06em;
	}

	.position {
		font-family: var(--font-body-bold);
		font-size: 10px;
		line-height: 18px;
		letter-spacing: 0.05em;
	}

	.name-romaji + .position {
		margin-top: 18px;
	}

	.bio {
		/* 1979年生まれ... */
		width: 100%;
		margin: 14px auto 0 0;
		font-family: var(--font-body-bold);
		font-size: 11px;
		line-height: 24px;
		color: #000;
		letter-spacing: 0.06em;
	}


	@media screen and (width >= 1024px) {
		.put-image-right {
			display: flex;
			flex-direction: row;
			padding-left: 95px;
			margin-top: 90px;
		}

		.image-wrapper-first{
			flex-shrink: 0;
			width: 574px;
			height: 395px;

		}

		.image-wrapper-first > :global(img){
			width: 100%;
			height: auto;
		}

		.description {
			width: 424px;
		}

		.name-romaji + .position {
			margin-top: 19px;
		}

		.bio {
			width: 372px;
			margin-top: 44px;
		}
	}
</style>
