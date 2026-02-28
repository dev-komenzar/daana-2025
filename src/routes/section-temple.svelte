<script lang="ts">
import { floatUp } from '$lib/actions'
import Photo from '$lib/assets/ryugen-converted.png'
import EnhancedImage from '$lib/components/ui/enhanced-image.svelte'
import Link from '$lib/components/ui/link.svelte'

const p = {
	bio: `
大阪外国語大学（現：大阪大学）外国語学部卒、同大大学院東南アジア・オセアニア地域言語社会研究科博士前期課程修了、修士(学術)。ミャンマー仏教の文化人類学的研究を行う中で、研究より実践に惹かれ仏教者として生きることを志す。当初日本仏教界に縁がなく、武術の指導者として世に向かおうとするも2010年に縁を得て出家・修行（真言律宗総本山西大寺）。伝統や学術を大切にしつつも、囚われない「今に活きる仏教思想」の社会実装を提唱し、実験寺院の概念と方法論を創案。日本仏教徒協会設立の礎となる。
多くの起業家、経営者、医師や学生などの精神的指導者として信頼を寄せられている。
`,
	imageUrl: Photo,
	name: '松波龍源',
	nameRomaji: 'Ryugen Matsunami',
	positions: ['日本仏教徒協会 最高顧問 / Principal Advisor, Japan Buddhist Association', '実験寺院グループ 総監    / Master of the Order , Experimental Buddhism Order', '実験寺院 寳幢寺 僧院長 / Temple Master , Hōdō-ji Temple'],
}
</script>

<section
	id="houdouji"
	class="container"
>
	<div class="wide-content">
		<h2
			class="text-large section-header"
			use:floatUp
		>
			Experimental Buddhism Order
		</h2>
		<h3
			class="text-medium section-header-japanese houdouji"
			use:floatUp
		>
			実験寺院グループ_執行部
		</h3>
	</div>
	<div class="wide-content body">
		<div class="card">
			<div
				class="image-wrapper"
				use:floatUp
			>
				<EnhancedImage
					src={p.imageUrl}
					alt={p.name}
				/>
			</div>

			<div class="description">
				<h3
					class="name"
					use:floatUp
				>
					{p.name}
				</h3>
				<p
					class="name-romaji"
					use:floatUp
				>
					{p.nameRomaji}
				</p>
				{#each p.positions as position (position)}
					<p
						class="position"
						use:floatUp
					>
						{position}
					</p>
				{/each}
				<p
					class="bio"
					use:floatUp
				>
					{p.bio}
				</p>
				<div
					class="link"
					use:floatUp
				>
					<Link
						href="/interview-ryugen"
						textContent="VIEW MORE"
					/>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
#houdouji {
	margin-top: 200px;
}

.houdouji {
	color: #ff8957;
}

.body {
	margin-top: 30px;
}

.image-wrapper {
	width: 490px;
	max-width: 100%;
	height: auto;
	aspect-ratio: 490 / 330;
	overflow: hidden;
}

.image-wrapper :global(img) {
	width: 100%;
	height: 100%;
	object-fit: cover;
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
	font-size: 14px;
	line-height: 16px;
	color: #000;
	letter-spacing: 0.06em;
}

.position {
	font-family: var(--font-body-bold);
	font-size: 14px;
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
	font-family: var(--font-body);
	font-size: 14px;
	line-height: 24px;
	color: #000;
	letter-spacing: 0.06em;
}

.link {
	margin: 35px auto 0;
}

@media (width >= 1024px) {
	.card {
		display: flex;
		flex-direction: row;
		column-gap: 95px;
		align-items: flex-start;
	}

	.image-wrapper {
		width: 490px;
		height: 330px;
		overflow: hidden;
	}

	.description {
		width: 424px;
	}

	.bio {
		width: 372px;
	}
}
</style>
