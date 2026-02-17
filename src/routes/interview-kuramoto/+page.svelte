<script lang="ts">
import Portrait from '$lib/assets/interview-kuramoto/portrait-c.jpg'
import PhotoTalking from '$lib/assets/interview-kuramoto/talking-c.jpg'
import EnhancedImage from '$lib/components/ui/enhanced-image.svelte'

const p = {
	bio: `1979年生まれ。福岡県出身。東京大学教養学部卒業、同大大学院総合文化研究科博士課程単位取得退学。博士(学術)・専門は文化人類学。2006年からミャンマーで出家を含む現地調査を行う。2015年から実験寺院・寳幢寺の設立準備・運営に関わる。著書に「世俗を生きる出家者たち」(法蔵館)、Living with the Vinaya(University of Hawaii Press)など。新著『仏教を「経営」する』(NHK出版)では、ミャンマーの２つの寺院及び寳幢寺を事例として、現代社会における仏教の可能性について検討している。`,
	imageUrl: Portrait,
	name: '藏本 龍介',
	nameRomaji: 'Kuramoto Ryusuke',
	positions: ['日本仏教徒協会 代表理事', '東京大学東洋文化研究所教授'],
}
</script>

<section class="container">
	<div class="full-content put-image-right">
		<div class="description content">
			<p class="pre-heading">
				実験寺院の取り組みについて、<br />
				代表理事にインタビューしてみました。
			</p>
			<h1>{p.name}</h1>
			<p class="name-romaji">{p.nameRomaji}</p>
			{#each p.positions as position (position)}
				<p class="position">{position}</p>
			{/each}
			<p class="bio">{p.bio}</p>
		</div>
		<div class="image-wrapper-portrait content">
			<EnhancedImage src={p.imageUrl} alt={p.name} />
		</div>
	</div>

	<div class="wide-content">
		<h3 class="subheading">「研究」から「社会実装」へ</h3>
		<p class="body">問い：実験寺院プロジェクトに関わることになったきっかけについて教えてください。</p>
		<p class="body">答え：「参与観察」のその先へ進み、仮説を社会実装するためです。私は長年、ミャンマーの上座部仏教をフィールドワークの対象としてきました。現地で目の当たりにしたのは、仏教が単なる個人の信仰心に留まらず、社会のセーフティーネットや教育機関、あるいは経済の循環装置として機能している姿でした。一方で、日本の現状を分析すると、仏教が持つこれら「社会インフラ」としての機能が著しく低下しています。研究者として「日本仏教は制度疲労を起こしている」と論文を書くことは容易ですが、それでは現実は変わりません。もし、2500年の歴史を持つ仏教を、現代日本社会に合わせて再設計できたなら、それは現代人が抱える諸課題への有効な解になるのではないか。この可能性を自らの身体を使って検証するために、外からの観察ではなく、当事者としてリスクを負い、実社会で実験を行いたいと考えました。</p>

		<h3 class="subheading">日本仏教の課題</h3>
		<p class="body">問い：日本仏教が抱える課題について、どう分析されていますか。</p>
		<p class="body">答え：寺院運営と「家」が密接に結びついている点に、構造的な難しさがあると考えています。日本の寺院の多くは、住職とそのご家族が代々守り継ぐ、いわゆる「家業」に近い形態をとっています。このシステムは、地域コミュニティの中で信仰を継承していく上で重要な役割を果たしてきました。一方で、寺院の運営と家族の生活基盤が直結しているため、どうしても「公的な活動」よりも「家の維持」にリソースを割かざるを得ない側面があります。その結果、活動が葬儀や墓地管理といった特定の役割に固定化されやすいのが現状です。そこで私たちは、寺院の運営を「家」から切り離し、社会共有の「公器（コモンズ）」として再定義する試みを行っています。僧侶が生活の不安なく、専門職として仏教の実践と指導に専念できる環境を、組織として整える。公と私の役割分担を見直すことで、仏教が持つ本来の社会性を回復できると考えています。</p>
	</div>

	<div class="full-content put-image-left">
		<div class="image-wrapper-second">
			<EnhancedImage src={PhotoTalking} alt="倉本教授近影" />
		</div>
		<div class="description-second">
			<p class="body">問い：なぜ「伝統仏教」の枠組みの中で改革を行わなかったのですか。</p>
			<p class="body">答え：「守るべきものがある場所」と「新しい実験をする場所」を分ける必要があると考えたからです。まず強調したいのは、伝統仏教には、数百年、千年という時間軸で地域社会や家を守り、人々の心の拠り所となってきた、かけがえのない役割があるということです。既存の教団の中にも、高い志と優れた見識を持つ僧侶は数多くいらっしゃいます。しかし、彼らの多くは歴史ある伽藍や檀家制度、あるいは地域コミュニティを守るという重責を担っています。そうした「守り」の構造の中で、前例のない、失敗するかもしれない社会実験を行うことは、現実的に非常に困難です。既存の寺院が安定を志向するのは、その社会的責任の重さゆえでもあります。だからこそ、私たちは別の選択肢をとりました。「新しい酒は新しい革袋に」という言葉があるように、現代社会に向けた新しい仏教の実装実験を行うには、しがらみのない、身軽な「容れ物」が不可欠です。私たちは宗教法人ではなく、「一般社団法人」として出発し、現在は「公益社団法人」を目指しているのですが、それは伝統を否定するためではありません。伝統寺院が担う「保存・継承」の役割と、私たちが担う「活用・実装」の役割。この二つが車の両輪のように機能することで、日本仏教全体の可能性が広がると考えています。</p>
		</div>
	</div>
</section>

<style>
.container {
	margin-top: 10rem;
}

.pre-heading {
	/* 実験寺院の取り組みについて、 実験寺院グループ総監にインタビューしてみました。 */
	font-family: var(--font-heading-bold);
	font-size: 16px;
	line-height: 30px;
	color: #000;
	letter-spacing: 0.12em;
}

h1 {
	/* 松波龍源 */
	margin: 13px auto 0;
	font-family: var(--font-body-bold);
	font-size: 25px;
	line-height: 36px;
	color: #000;
	letter-spacing: 0.12em;
}

.pre-heading + h1 {
	margin-top: 90px;
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

.position + .bio {
	margin-top: 44px;
}

.subheading {
	padding-top: 150px;
	font-family: var(--font-heading-bold);
	font-size: 20px;
	line-height: 30px;
	letter-spacing: 0.06em;
}

.body {
	font-family: var(--font-body);
	font-size: 16px;
	line-height: 30px;
	letter-spacing: 0.06em;
}

.body.space-top {
	padding-top: 2em;
}

@media (width >= 1024px) {
	.container {
		margin-top: 165px;
	}

	.put-image-right {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding-left: 95px;
	}

	.description {
		width: 372px;
	}

	.content {
		margin-right: 0;
	}

	.image-wrapper-portrait {
		flex-shrink: 0;
		width: 562px;
		height: 578px;
	}

	.put-image-left {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.wide-content + .put-image-left {
		margin-top: 76px;
	}

	.image-wrapper-second {
		width: 489px;
		height: 470px;
		margin-left: 0;
	}

	.description-second {
		width: 500px;
		margin-right: 95px;
		margin-left: 70px;
	}
}
</style>
