<script lang="ts">
import { floatUp } from '$lib/actions'
import Familymart from '$lib/assets/access/familymart.jpg'
import Image1_1 from '$lib/assets/access/image1-1.jpeg'
import Image1_2 from '$lib/assets/access/image1-2.jpeg'
import Image1_3 from '$lib/assets/access/image1-3.jpeg'
import Image1_5 from '$lib/assets/access/image1-5.jpeg'
import Image1_6 from '$lib/assets/access/image1-6.jpeg'
import Image2_1 from '$lib/assets/access/image2-1.jpeg'
import Image2_2 from '$lib/assets/access/image2-2.jpeg'
import EnhancedImage from '$lib/components/ui/enhanced-image.svelte'
</script>

<section class="container">
	<h1 use:floatUp>アクセス</h1>

	<section class="map-section">
		<p
			class="map-description"
			use:floatUp
		>
			「実験寺院」で検索
		</p>
		<iframe
			class="map"
			loading="lazy"
			sandbox="allow-scripts allow-popups allow-forms"
			src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3267.0164342202406!2d135.7518104775194!3d35.03131876539885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6001096d14f14739%3A0x1aec7cbf92c0fe01!2z5pel5pys5LuP5pWZ5b6S5Y2U5Lya77yP5a6f6aiT5a-66ZmiIOWvs-W5ouWvug!5e0!3m2!1sja!2sjp!4v1684677567939!5m2!1sja!2sjp"
			title="Google Map"
		></iframe>
	</section>

	<section
		class="access-info"
		use:floatUp
	>
		<h2>電車・バスなどの<wbr />アクセス</h2>
		<h3>最寄駅</h3>
		<p>京都市営地下鉄「今出川駅」より徒歩10分</p>
		<p>京都市バス「堀川今出川」より徒歩５分</p>
		<a href="#guide">
			<p class="link">→今出川駅からの道順</p>
		</a>
		<h3>京都駅から</h3>
		<p>京都駅からタクシーで約20分。タクシーGOをご利用の際は「実験寺院」でご検索ください。</p>
	</section>

	<section
		class="guide-section"
		id="guide"
	>
		<h2 use:floatUp>今出川駅からの道順</h2>
		<div
			class="guide-item"
			use:floatUp
		>
			<div class="image-wrapper">
				<EnhancedImage
					src={Image1_1}
					alt="4番出口を出て、右へ"
				/>
			</div>
			<p>4番出口を出て、右へ</p>
		</div>
		<div
			class="guide-item"
			use:floatUp
		>
			<div class="image-wrapper">
				<EnhancedImage
					src={Image1_2}
					alt="信号のある交差点の歩道を道なりに右折"
				/>
			</div>
			<p>信号のある交差点の歩道を<wbr />道なりに右折</p>
		</div>
		<div
			class="guide-item"
			use:floatUp
		>
			<div class="image-wrapper">
				<EnhancedImage
					src={Image1_3}
					alt="モスバーガーの前を通って、そのまま歩道を直進 (7分程度)"
				/>
			</div>
			<p>モスバーガーの前を通って、<wbr />そのまま歩道を直進 (7分程度)</p>
		</div>
		<div
			class="guide-item"
			use:floatUp
		>
			<div class="image-wrapper">
				<EnhancedImage
					src={Familymart}
					alt="ファミリーマートのある交差点を、右折"
				/>
			</div>
			<p>ファミリーマートのある<wbr />交差点を右折</p>
		</div>
		<div
			class="guide-item"
			use:floatUp
		>
			<div class="image-wrapper">
				<EnhancedImage
					src={Image1_5}
					alt="１５０ｍほど直進。左手にパーキングが見えたら、その向かい側が寳幢寺です"
				/>
			</div>
			<p>１５０ｍほど直進。<wbr />左手にパーキングが見えたら、<wbr />その向かい側が寳幢寺です</p>
		</div>
		<div
			class="guide-item"
			use:floatUp
		>
			<div class="image-wrapper">
				<EnhancedImage
					src={Image1_6}
					alt="外観はこのような白いビルです"
				/>
			</div>
			<p>外観は<wbr />このような白いビルです</p>
		</div>
	</section>

	<section class="guide-section">
		<h2 use:floatUp>今出川駅エレベーター<wbr />からの道順</h2>
		<div
			class="guide-item"
			use:floatUp
		>
			<div class="image-wrapper">
				<EnhancedImage
					src={Image2_1}
					alt="今出川駅エレベーターは3番出口に出ます"
				/>
			</div>
			<p>今出川駅エレベーターは<wbr />3番出口に出ます</p>
		</div>
		<div
			class="guide-item"
			use:floatUp
		>
			<div class="image-wrapper">
				<EnhancedImage
					src={Image2_2}
					alt="エレベーターを降りたら目の前の信号を渡って左手に見える大通り(今出川通り)沿いに直進"
				/>
			</div>
			<p>エレベーターを降りたら<wbr />目の前の信号を渡って<wbr />左手に見える大通り<wbr />(今出川通り)沿いに直進</p>
		</div>
		<div
			class="guide-item"
			use:floatUp
		>
			<div class="image-wrapper">
				<EnhancedImage
					src={Image1_3}
					alt="モスバーガーの前を通って、そのまま歩道を直進 (7分程度)"
				/>
			</div>
			<p>モスバーガーの前を通って、<wbr />そのまま歩道を直進 (7分程度)</p>
		</div>
		<div
			class="guide-item"
			use:floatUp
		>
			<div class="image-wrapper">
				<EnhancedImage
					src={Familymart}
					alt="ファミリーマートのある交差点を、右折"
				/>
			</div>
			<p>ファミリーマートのある<wbr />交差点を、右折</p>
		</div>
		<div
			class="guide-item"
			use:floatUp
		>
			<div class="image-wrapper">
				<EnhancedImage
					src={Image1_5}
					alt="１５０ｍほど直進。左手にパーキングが見えたら、その向かい側が寳幢寺です"
				/>
			</div>
			<p>１５０ｍほど直進。<wbr />左手にパーキングが見えたら、<wbr />その向かい側が寳幢寺です</p>
		</div>
		<div
			class="guide-item"
			use:floatUp
		>
			<div class="image-wrapper">
				<EnhancedImage
					src={Image1_6}
					alt="外観はこのような白いビルです"
				/>
			</div>
			<p>外観はこのような白いビルです</p>
		</div>
	</section>
</section>

<style>
.container {
	padding: 120px 24px 80px;
}

h1 {
	margin-bottom: 48px;
	font-family: var(--font-heading-bold);
	font-size: 24px;
	text-align: center;
	letter-spacing: 0.12em;
}

.map-section {
	max-width: 800px;
	margin: 0 auto 64px;
}

.map-description {
	margin-bottom: 8px;
	font-family: var(--font-body);
	font-size: 14px;
}

.map {
	width: 100%;
	height: 400px;
	border: 0;
}

.access-info {
	max-width: 500px;
	margin: 0 auto 80px;
	font-family: var(--font-body);
	word-break: auto-phrase;
}

.access-info h2 {
	margin-bottom: 32px;
	font-family: var(--font-heading-bold);
	font-size: 20px;
	text-align: center;
	letter-spacing: 0.06em;
}

.access-info h3 {
	margin-bottom: 8px;
	font-family: var(--font-body-bold);
	font-size: 16px;
}

.access-info .link {
	color: var(--color-primary, #059669);
}

.guide-section {
	max-width: 500px;
	margin: 0 auto 80px;
}

.guide-section h2 {
	margin-bottom: 48px;
	font-family: var(--font-heading-bold);
	font-size: 20px;
	text-align: center;
	letter-spacing: 0.06em;
}

.guide-item {
	margin-bottom: 32px;
}

.guide-item .image-wrapper {
	width: 100%;
	margin-bottom: 12px;
}

.guide-item p {
	font-family: var(--font-body);
	font-size: 14px;
	line-height: 1.8;
	text-align: center;
	word-break: auto-phrase;
}

.access-info p {
	margin-bottom: 16px;
	font-size: 14px;
	line-height: 1.8;
}

.access-info h3 + p {
	margin-bottom: 8px;
}

@media screen and (width >= 768px) {
	.container {
		padding: 165px 48px 120px;
	}

	h1 {
		font-size: 28px;
	}

	.access-info {
		max-width: 600px;
	}

	.access-info h2 {
		font-size: 24px;
	}

	.access-info p {
		font-size: 16px;
	}

	.guide-section {
		max-width: 600px;
	}

	.guide-section h2 {
		font-size: 24px;
	}

	.guide-item p {
		font-size: 16px;
	}
}
</style>
