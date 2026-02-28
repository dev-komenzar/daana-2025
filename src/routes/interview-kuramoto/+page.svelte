<script lang="ts">
import { floatUp } from '$lib/actions'
import Portrait from '$lib/assets/interview-kuramoto/portrait-c.jpg'
import PhotoTalking from '$lib/assets/interview-kuramoto/talking-c.jpg'
import PhotoZengain from '$lib/assets/interview-kuramoto/zenga_in-c.jpg'
import EnhancedImage from '$lib/components/ui/enhanced-image.svelte'

const p = {
	bio: `1979年生まれ。福岡県出身。東京大学教養学部卒業、同大大学院総合文化研究科博士課程単位取得退学。博士(学術)・専門は文化人類学。2006年からミャンマーで出家を含む現地調査を行う。2015年から実験寺院・寳幢寺の設立準備・運営に関わる。著書に「世俗を生きる出家者たち」(法蔵館)、Living with the Vinaya(University of Hawaii Press)など。新著『仏教を「経営」する』(NHK出版)では、ミャンマーの２つの寺院及び寳幢寺を事例として、現代社会における仏教の可能性について検討している。`,
	imageUrl: Portrait,
	name: '藏本 龍介',
	nameRomaji: 'Kuramoto Ryosuke',
	positions: ['日本仏教徒協会 代表理事', '東京大学東洋文化研究所教授'],
}
</script>

<section class="container">
	<div class="full-content put-image-right">
		<div class="description space-description">
			<p
				class="pre-heading"
				use:floatUp
			>
				実験寺院の取り組みについて、<br />
				代表理事にインタビューしてみました。
			</p>
			<h1 use:floatUp>{p.name}</h1>
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
		</div>
		<div
			class="image-wrapper portrait"
			use:floatUp
		>
			<EnhancedImage
				src={p.imageUrl}
				alt={p.name}
			/>
		</div>
	</div>

	<div class="wide-content">
		<h3
			class="subheading"
			use:floatUp
		>
			「研究」から「社会実装」へ
		</h3>
		<p
			class="body"
			use:floatUp
		>
			問い：実験寺院プロジェクトに関わることになったきっかけについて教えてください。
		</p>
		<p
			class="body"
			use:floatUp
		>
			答え：「参与観察」のその先へ進み、仮説を社会実装するためです。私は長年、ミャンマーの上座部仏教をフィールドワークの対象としてきました。現地で目の当たりにしたのは、仏教が単なる個人の信仰心に留まらず、社会のセーフティーネットや教育機関、あるいは経済の循環装置として機能している姿でした。一方で、日本の現状を分析すると、仏教が持つこれら「社会インフラ」としての機能が著しく低下しています。研究者として「日本仏教は制度疲労を起こしている」と論文を書くことは容易ですが、それでは現実は変わりません。もし、2500年の歴史を持つ仏教を、現代日本社会に合わせて再設計できたなら、それは現代人が抱える諸課題への有効な解になるのではないか。この可能性を自らの身体を使って検証するために、外からの観察ではなく、当事者としてリスクを負い、実社会で実験を行いたいと考えました。
		</p>

		<h3
			class="subheading"
			use:floatUp
		>
			日本仏教の課題
		</h3>
		<p
			class="body"
			use:floatUp
		>
			問い：日本仏教が抱える課題について、どう分析されていますか。
		</p>
		<p
			class="body"
			use:floatUp
		>
			答え：寺院運営と「家」が密接に結びついている点に、構造的な難しさがあると考えています。日本の寺院の多くは、住職とそのご家族が代々守り継ぐ、いわゆる「家業」に近い形態をとっています。このシステムは、地域コミュニティの中で信仰を継承していく上で重要な役割を果たしてきました。一方で、寺院の運営と家族の生活基盤が直結しているため、どうしても「公的な活動」よりも「家の維持」にリソースを割かざるを得ない側面があります。その結果、活動が葬儀や墓地管理といった特定の役割に固定化されやすいのが現状です。そこで私たちは、寺院の運営を「家」から切り離し、社会共有の「公器（コモンズ）」として再定義する試みを行っています。僧侶が生活の不安なく、専門職として仏教の実践と指導に専念できる環境を、組織として整える。公と私の役割分担を見直すことで、仏教が持つ本来の社会性を回復できると考えています。
		</p>
	</div>

	<div class="full-content put-image-left">
		<div
			class="image-wrapper second"
			use:floatUp
		>
			<EnhancedImage
				src={PhotoTalking}
				alt="倉本教授近影"
			/>
		</div>
		<div class="description-second space-description">
			<p
				class="body"
				use:floatUp
			>
				問い：なぜ「伝統仏教」の枠組みの中で改革を行わなかったのですか。
			</p>
			<p
				class="body"
				use:floatUp
			>
				答え：「守るべきものがある場所」と「新しい実験をする場所」を分ける必要があると考えたからです。まず強調したいのは、伝統仏教には、数百年、千年という時間軸で地域社会や家を守り、人々の心の拠り所となってきた、かけがえのない役割があるということです。既存の教団の中にも、高い志と優れた見識を持つ僧侶は数多くいらっしゃいます。しかし、彼らの多くは歴史ある伽藍や檀家制度、あるいは地域コミュニティを守るという重責を担っています。そうした「守り」の構造の中で、前例のない、失敗するかもしれない社会実験を行うことは、現実的に非常に困難です。既存の寺院が安定を志向するのは、その社会的責任の重さゆえでもあります。だからこそ、私たちは別の選択肢をとりました。「新しい酒は新しい革袋に」という言葉があるように、現代社会に向けた新しい仏教の実装実験を行うには、しがらみのない、身軽な「容れ物」が不可欠です。私たちは宗教法人ではなく、「一般社団法人」として出発し、現在は「公益社団法人」を目指しているのですが、それは伝統を否定するためではありません。伝統寺院が担う「保存・継承」の役割と、私たちが担う「活用・実装」の役割。この二つが車の両輪のように機能することで、日本仏教全体の可能性が広がると考えています。
			</p>
		</div>
	</div>

	<div class="wide-content">
		<h3
			class="subheading"
			use:floatUp
		>
			「実験寺院」プロジェクトの特徴
		</h3>
		<p
			class="body"
			use:floatUp
		>
			問い：運営において「対価（料金）」ではなく「布施」を原則としているのはなぜですか。
		</p>
		<p
			class="body"
			use:floatUp
		>
			答え：資本主義的な「交換の論理」に対する、経済的な実験だからです。市場経済において、サービスと対価は等価交換が原則です。「これだけ払ったのだから、これだけのサービスを受け取る権利がある」という消費者マインドは、自己と他者を分断し、自我を強化します。しかし仏教が目指すのは、その自我（エゴ）の固着からの解放です。「布施」とは、見返りを求めない贈与です。定価を設けず、参加者の自発的な意志に委ねることで、私たちは市場原理とは異なる経済圏──信頼と贈与による循環──を構築しようとしています。これは単なる集金方法の違いではなく、貨幣を通じた人間関係の再構築という、極めて現代的な挑戦なのです。
		</p>

		<p
			class="body space-top"
			use:floatUp
		>
			問い：「実験寺院」という名称には、どのような含意があるのでしょうか。
		</p>
		<p
			class="body"
			use:floatUp
		>
			答え：「設計主義」からの脱却と、知的謙虚さの表明です。 設立当初、私たちは「理想的な寺院モデル」を頭の中で設計し、それを現実に当てはめようとして失敗しました。複雑な現代社会において、最初から「正解」を提示することは不可能です。必要なのは、確固たる理念を持ちつつも、目の前の現実に即してシステムを柔軟に更新し続ける試行錯誤を前提とした姿勢です。「実験」という言葉には、失敗を許容し、データに基づいて常に軌道修正を図るという、私たちの科学的かつ実務的な態度が込められています。
		</p>

		<p
			class="body space-top"
			use:floatUp
		>
			問い：このプロジェクトのゴールはどこにありますか。
		</p>
		<p
			class="body"
			use:floatUp
		>
			答え：この仕組み自体を「オープンソース化」することです。私たち一法人が成功し、拡大すること自体はゴールではありません。目指しているのは、日本仏教をアップデートするための「代替モデル（プロトタイプ）」を完成させることです。「家業」ではない寺院運営は可能なのか。市場原理によらない経済的自立は成し得るのか。私たちがリスクを取って実証したこのノウハウが、将来、志ある僧侶や次世代の寺院運営者にとっての「型」となり、日本各地で多様な仏教実践が花開くこと。それが、研究者であり代表理事である私の描く未来図です。
		</p>
	</div>

	<div class="full-content put-image-right">
		<div class="description-third space-description">
			<h3
				class="subheading"
				use:floatUp
			>
				参加と支援のお願い
			</h3>
			<p
				class="body"
				use:floatUp
			>
				問い：どのような方々に、この「実験」へ参加してほしいと考えていますか。
			</p>
			<p
				class="body"
				use:floatUp
			>
				答え：受動的な「救い」ではなく、知的な「問い」を共有できる方々です。 誤解を恐れずに言えば、私たちは「救い」を求めてただ依存するだけのあり方を推奨していません。求めているのは、既存の価値観に安住せず、自らの知性で真理を探究しようとする「問い」を持つ方々です。実際、寳幢寺に足繁く通われているのは、経営者や起業家、あるいは第一線で活躍するクリエイターの方々です。彼らは決して安易な「癒やし」を求めているのではありません。不確実で正解のない現代社会において、重大な決断を下すためのブレない「軸」──すなわち、強靭な哲学（OS）を求めているのです。ここは、ただ座って救済を待つ場所ではなく、自らの足で登るための「道場」です。社会の常識を疑い、共に新しい時代の精神を紡ぎ出そうとする、知的な体力のある方々との出会いを期待しています。
			</p>
		</div>
		<div
			class="image-wrapper third"
			use:floatUp
		>
			<EnhancedImage
				src={PhotoZengain}
				alt="禅河院での様子"
			/>
		</div>
	</div>
</section>

<style>
.container {
	margin-top: 10rem;
}

.space-description {
	width: 92%;
	max-width: 650px;
	margin: 0 auto;
}

.put-image-right,
.put-image-left {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.image-wrapper {
	max-width: 450px;
}

.description + .image-wrapper.portrait {
	margin-top: 100px;
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
	font-family: var(--font-heading-bold);
	font-size: 20px;
	line-height: 30px;
	letter-spacing: 0.06em;
}

.wide-content > .subheading {
	padding-top: 150px;
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

.wide-content + .put-image-left {
	margin-top: 76px;
}

.image-wrapper.second + .description-second {
	margin-top: 70px;
}

.description-third + .image-wrapper.third {
	margin-top: 100px;
}

@media screen and (width >= 768px) {
	.space-description {
		width: calc(100% - 2 * var(--wide-content-space));
		max-width: 1200px;
		margin: 0 var(--wide-content-space);
	}
}

@media screen and (width >= 1024px) {
	.container {
		margin-top: 165px;
	}

	.space-description {
		width: 100%;
		max-width: none;
		margin: 0;
	}

	.image-wrapper {
		max-width: none;
	}

	.put-image-right {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding-left: var(--wide-content-space);
	}

	.description {
		width: 372px;
	}

	.image-wrapper.portrait {
		flex-shrink: 0;
		width: 562px;
		height: 578px;
	}

	.description + .image-wrapper.portrait {
		margin-left: 100px;
	}

	.put-image-left {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding-right: var(--wide-content-space);
	}

	.image-wrapper.second {
		width: 489px;
		height: 470px;
		margin-left: 0;
	}

	.description-second {
		width: 500px;
	}

	.image-wrapper.second + .description-second {
		margin-left: 70px;
	}

	.wide-content + .put-image-right {
		margin-top: 194px;
	}

	.description-third {
		width: 376px;
	}

	.description-third > .subheading {
		padding-top: 0;
	}

	.image-wrapper.third {
		width: 556px;
		height: 562px;
	}

	.description-third + .image-wrapper.third {
		margin-left: 100px;
	}
}
</style>
