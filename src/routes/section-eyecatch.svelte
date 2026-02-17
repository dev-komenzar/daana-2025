<script lang="ts">
</script>

<section id="eyecatch" class="eyecatch-section">
	<div class="hero-container eyecatch-container">
		<div class="eyecatch-content">
			<p class="eyecatch-meta">OUR MISSION</p>
			<h1 class="eyecatch-title">「仏教かもしれない」</h1>

			<p class="eyecatch-description">
				宗教や伝統文化としてではない、純粋な「思想・哲学」としての仏教は、<br />
				最もフラットで論理破綻のない、人類のOSとしての最高到達地点ではないか？<br />
				次の時代の人類哲学は「仏教かもしれない」
			</p>
			<p class="eyecatch-description">
				長い歴史と、文化的な経緯によって「宗教」の衣を纏い<br />
				「使いにくくなってしまった」仏教思想を、もう一度「普遍的な人類の哲学」に戻す。<br />
				原題の人類社会に、使いやすいものへと橋を渡す。<br />
				「誰もが使える仏教思想」の提供を目指します。
			</p>
		</div>
	</div>
</section>

<style>
.eyecatch-section {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100lvh;
	padding: var(--space-16) 0;
}

.eyecatch-container {
	z-index: 1;
}

.eyecatch-content {
	max-width: 800px;
}

.eyecatch-meta {
	margin-bottom: 32px;
	font-family: var(--font-heading-bold);
	font-size: 36px;
	line-height: 44px;
	letter-spacing: -0.01em;
}

.eyecatch-title {
	padding: 0 var(--space-4);
	margin: 0 0 33px;
	font-family: var(--font-body-bold);
	font-size: 25px;
	line-height: 1.4;
	color: var(--color-white);
	text-align: center;
	letter-spacing: 0.06em;
}

.eyecatch-description {
	font-family: var(--font-body);
	font-size: 14px;
	line-height: 24px;
	letter-spacing: 0.06em;
}

.eyecatch-description + .eyecatch-description {
	margin: 30px 0 0;
}
</style>
