<script lang="ts">
	import Photo from "$lib/assets/ryugen.jpg";

	const p = {
		bio: `
ミャンマー仏教の文化人類学的研究を行う中で、研究より実践に惹かれ仏教者として生きることを志す。当初日本仏教界に縁がなく、武術の指導者として世に向かおうとするも2010年に縁を得て出家・修行（真言律宗総本山西大寺）。伝統や学術を大切にしつつも、囚われない「今に活きる仏教思想」の社会実装を提唱し、実験寺院の概念と方法論を創案。日本仏教徒協会設立の礎となる。
多くの起業家、経営者、医師や学生などの精神的指導者として信頼を寄せられている。
`,
		imageUrl: Photo,
		name: "松波龍源",
		nameRomaji: "Ryugen Matsunami",
		position: "実験寺院 寳幢寺 僧院長",
	};
</script>

<section id="houdouji">
	<div class="wide-content">
		<h2 class="text-large section-header">Houdouji</h2>
		<h3 class="text-medium section-header-japanese houdouji">
			実験寺院寳幢寺
		</h3>
	</div>
	<div class="wide-content body">
		<div class="card">
			<img src={p.imageUrl} alt={p.name} />

			<div class="description">
				<p class="position">{p.position}</p>
				<h3 class="name">{p.name}</h3>
				<p class="name-romaji">{p.nameRomaji}</p>
				<p class="bio">{p.bio}</p>
			</div>
		</div>
	</div>
</section>

<style>
	#houdouji {
		margin-top: calc(95px * 2);
	}

	.houdouji {
		color: #ff8957;
	}

	.body {
		margin: 30px auto 0;
	}

	.card {
		display: flex;
		flex-direction: row;
		column-gap: 95px;
		align-items: flex-start;
	}

	.description {
		font-family: var(--font-gothic-bold);
		text-align: left;
	}

	.position {
		/* 代表理事 */
		margin: 0;
		font-family: var(--font-gothic-bold);
		font-size: 13px;
		line-height: 19px;
		color: #000;
		letter-spacing: 0.06em;
	}

	.name {
		/* 藏本龍介 */
		margin: 13px auto 0;
		font-family: var(--font-gothic-bold);
		font-size: 25px;
		line-height: 36px;
		color: #000;
		letter-spacing: 0.12em;
	}

	.name-romaji {
		/* Kuramoto Ryosuke */
		font-family: var(--font-gothic-bold);
		font-size: 13px;
		line-height: 16px;
		color: #000;
		letter-spacing: 0.06em;
	}

	.bio {
		/* 1979年生まれ... */
		margin: 14px auto 0;
		font-family: var(--font-gothic-bold);
		font-size: 11px;
		line-height: 24px;
		color: #000;
		letter-spacing: 0.06em;
	}
</style>
