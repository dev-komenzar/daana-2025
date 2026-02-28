<script lang="ts">
import { resolve } from '$app/paths'
import ProjectHito from '$lib/assets/donation/project_hito-c.jpg'
import ProjectMono from '$lib/assets/donation/project_mono-c.jpg'
import EnhancedImage from '$lib/components/ui/enhanced-image.svelte'

import DonationButton from './button.svelte'

const newsHito = resolve('/news/xphu-2h7lj')
const newsMono = resolve('/news/xgalyh9t8t')
</script>

<h3>プロジェクトへのご寄付</h3>
<p>当協会は様々な取り組みを企画しております。</p>
<p>ご興味に合わせた「プロジェクトベース」のご寄付をお選び頂けます。</p>

<div class="subheading">
	<h4>「ひと」に関わる<wbr />プロジェクト</h4>
</div>

<div class="wrapper">
	<div class="image-wrapper">
		<EnhancedImage
			src={ProjectHito}
			alt="「ひと」に関わるプロジェクト"
		/>
	</div>
	<div class="description">
		<p>日本仏教徒協会は「未来を担うひとづくり」を行います。学校などではカバーできない「生き方・あり方」を地道に、確実に届けるための仕組み作りに取り組んでいます。</p>
		<p>「人間社会はそこに生きる人により、人のあり方はその人の考え方による」釈迦牟尼や弘法大師の説かれた真理です。まずは「ひとづくり」、その核心は「思想・哲学」にある。是非、我々のプロジェクトにご参画くださいませ。</p>
	</div>
</div>

<div class="button-wrapper">
	<DonationButton
		href={newsHito}
		label="ご寄付はこちらから"
	/>
</div>

<div class="subheading">
	<h4>「場所・もの」に関わる<wbr />プロジェクト</h4>
</div>

<div class="wrapper">
	<div class="image-wrapper">
		<EnhancedImage
			src={ProjectMono}
			alt="「もの」に関わるプロジェクト"
		/>
	</div>
	<div class="description">
		<p>ひとが学び、育つために「場の力」は不可欠です。「学びの場」を欠いて「よきひとづくり」はできません。</p>
		<p>古来「寺院や神殿」のような、日常から区切られた「聖なる場」は「思想・哲学の学び舎」でした。そして精神性を形にした彫刻や美術は、「ただ、そこにある」ことで、人々の心を育てました。</p>
		<p>我々は「寺院」を、観光や歴史遺産としてではなく「いまに即した実用の場」として創っていきます。「博物館のガラスケースの向こう側」ではなく「未来に向けたひとづくりの現場」として、現代の精神を形にする事業にご参画頂けませんか？</p>
	</div>
</div>

<div class="button-wrapper">
	<DonationButton
		href={newsMono}
		label="ご寄付はこちらから"
	/>
</div>

<style>
h3 {
	margin-bottom: 24px;
	font-family: var(--font-body-bold);
	font-size: 24px;
	line-height: 1.6;
}

p {
	font-family: var(--font-body);
	font-size: 14px;
	line-height: 30px;
	color: #333;
	letter-spacing: 0.08em;
}

.subheading {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: auto;
	padding-top: 0.5em;
	padding-bottom: 0.5em;
	background-color: #16212f;
}

p + .subheading {
	margin-top: 100px;
}

h4 {
	font-family: var(--font-body-bold);
	font-size: 18px;
	line-height: 30px;
	color: white;
	letter-spacing: 0.08em;
	word-break: keep-all;
}

.subheading + .wrapper {
	margin-top: 37px;
}

.description {
	text-align: left;
}

.image-wrapper + .description {
	margin-top: 40px;
}

.button-wrapper {
	margin-top: 54px;
}

.button-wrapper + .subheading {
	margin-top: 200px;
}

@media screen and (width >= 1024px) {
	.wrapper {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 30px;
	}

	.image-wrapper + .description {
		margin-top: 0;
	}
}
</style>
