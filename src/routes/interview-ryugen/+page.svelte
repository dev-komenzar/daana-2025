<script lang="ts">
	import { floatUp } from '$lib/actions';
	import Photo from '$lib/assets/interview-ryugen/ryugen-c.jpg';
	import PhotoSecond from '$lib/assets/interview-ryugen/zenga_in-c.jpg';
	import PhotoThird from '$lib/assets/interview-ryugen/zenga_in_2-c.jpg';
	import PhotoFourth from '$lib/assets/interview-ryugen/zenga_in_exterior-c.jpg';
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
		<h2 class="pre-heading" use:floatUp>実験寺院の取り組みについて、<br/>実験寺院グループ総監にインタビューしてみました。</h2>
	</div>
	<div class="full-content put-image-right">
		<div class="description content">
			<h1 class='name' use:floatUp>{p.name}</h1>
			<p class="name-romaji" use:floatUp>{p.nameRomaji}</p>
			{#each p.positions as position (position)}
				<p class="position" use:floatUp>{position}</p>
			{/each}
			<p class="bio" use:floatUp>{p.bio}</p>
		</div>

		<div class="image-wrapper-first content" use:floatUp>
			<EnhancedImage src={p.imageUrl} alt={p.name}/>
		</div>
	</div>

	<div class="wide-content">
		<h3 class='interview-subheading' use:floatUp>2500年の「智の体系」を、現代へ</h3>
		<p class="interview-body" use:floatUp>問い：なぜ今、仏教なのでしょうか。</p>
		<p class="interview-body" use:floatUp>答え： 人間は常に何らかの「動機」をもって行動し、その根底には必ず思想や哲学があります。人間性とは、まさにそこに宿るものではないでしょうか。しかし現代社会では、自らの思想や哲学に自覚的な人は多くありません。この欠落こそが、社会の息苦しさや漠然とした不安の源ではないかと感じています。仏教は、「人はいかに考え、いかに生きるか」という問いに対し、釈迦牟尼を始祖として2500年にわたり蓄積されてきた、極めて精緻な智の体系です。私見では、これに匹敵する人間思想は他に見当たりません。実際、西洋哲学も20世紀以降、仏教思想に接近する潮流を見せています。 千年以上の仏教的蓄積をもつ日本において、この叡智を活用しない理由はないと考えています。</p>

		<h3 class="interview-subheading" use:floatUp>日本仏教が抱える「構造的機能不全」</h3>
		<p class="interview-body" use:floatUp>問い：藏本代表理事と共に日本仏教徒協会・実験寺院グループを立ち上げた経緯を教えてください。</p>
		<p class="interview-body" use:floatUp>答え： 藏本教授とは、ミャンマー仏教の人類学的研究を通じて知り合いました。日本仏教が機能不全に陥っているのではないか、という問題意識を共有していたことが出発点です。私たちは、その原因は個々の寺院や僧侶ではなく、社会全体の構造にあるのではないかと考えました。二人でなら、この課題に挑めるかもしれない――そのように意気投合したことが始まりです。</p>
		<p class="interview-body space-top" use:floatUp>問い：その「構造」とは何でしょうか。</p>
		<p class="interview-body" use:floatUp>答え：第一に、「期待されている役割」と「提供されているもの」の乖離です。</p>
		<p class="interview-body" use:floatUp>本来、仏教の中心的役割は思想・哲学・生き方の提示であり、儀礼や文化は副次的なはずです。しかし日本では、葬儀・法事、あるいは歴史文化・観光資源としての役割に極端に偏っています。その結果、思想としての仏教がほとんど認識されていません。</p>
		<p class="interview-body" use:floatUp>第二に、その需要構造の中で、寺院や僧侶が「サービス提供者」として生きることを強いられている現実があります。仏教哲学を専門に生きる道は研究者など「アカデミア」以外ほぼ存在しません。そしてそれらは「実践者」の道ではありません。</p>
		<p class="interview-body" use:floatUp>どれほど高い志や学識を持つ僧侶であっても、それを現代社会で発揮する場は限定されています。「本来の仏教」が社会と共にあることが難しい環境では、人々がその魅力に触れる機会も少なく、ニーズさえ生まれません。</p>
		<p class="interview-body" use:floatUp>私たちは、仏教を「サービス事業」や「歴史的遺物」に閉じ込めているこの構造そのものが、最大の解決すべき課題であると考えています。</p>
	</div>

	<div class="full-content put-image-left">
		<div class="image-wrapper-second content" use:floatUp>
			<EnhancedImage src={PhotoSecond} alt='禅河院' />
		</div>

		<div class="description content">
			<h3 class="interview-subheading" use:floatUp>取り組みの核：四つの原則</h3>
			<p class="interview-body" use:floatUp>問い：この構造的問題に対して、どのように取り組んでいるのでしょうか？</p>
			<p class="interview-body" use:floatUp>答え：私たちは「仏教思想の社会実装」と、そのための「構造改革」を目的としています。そのために、既存の日本仏教では曖昧にされてきた「出家者（プロ）」と「在家者（支え手）」の役割を徹底的に分けるという方法を検証しています。これは国際的には当然の構造です。</p>
			<p class="interview-body" use:floatUp>具体的には、以下の4点を堅守しています。</p>
			<ol use:floatUp>
				<li>出家者の完全な専業化 「出家」とは社会からの離脱です。兼業を禁じ、私有財産も持たず、収入は「お布施」のみ。国際的にも通用する、純粋な仏道の実践者としてのあり方を追求します。</li>
				<li>寺院資産の「私物化」を排除 寺院の資財はすべて、在家者による法人が管理します。出家者はその意思決定に関与できません。生活に必要な支出も法人が判断し、出家者の「無所有」をシステムとして担保します。</li>
				<li>「仏教のプロ」としての品質保証 出家者を、祭礼の代行業者や寺の管理人とは考えません。高度な知見と倫理を備えた「仏教のプロ」であることを求め、能力の研鑽を義務付けます。</li>
				<li>厳格なガバナンス 専門家や経営者による意思決定機関を設け、不適格な者は排除できる仕組みを作っています。出家者自身に「自分たちを評価する権限」を与えないことで、システムの腐敗を防ぎます。</li>
			</ol>
			<p class="interview-body" use:floatUp>この取り組みは、日本に国際常識に照らして通用する「理想的な出家者」と「それを支え、厳しく監視する在家者の集団」を創り出すことです。つまり、まともな仏教が機能するための「正しい人間関係の構造」を再構築しようというものです。</p>
		</div>
	</div>

	<div class="wide-content">
		<h3 class='interview-subheading' use:floatUp>試練と覚悟：理想への道のりで得た教訓</h3>
		<p class="interview-body" use:floatUp>問い：ここに到るまで、実際にどのような挑戦をしてきたのですか？</p>
		<p class="interview-body" use:floatUp>答え：始めにやってみたのが「ミャンマー式寺院運営の直輸入」でした。上手くいっている仕組みをそのまま使えば良いのでは？という単純な仮説です。これは全くうまく行きませんでした。日本とミャンマーは地理・気象条件も基層文化も全く違うからです。今考えれば単純で愚かでしたが、これはこれで貴重な実験データではありました。</p>
		<p class="interview-body" use:floatUp>次に、日本で行われている伝統仏教のあり方を導入する、ということも試しました。ご祈祷や瞑想指導、月毎の行事、朝粥会や文化セミナーなど、出来そうなことは一通りやってみました。しかし、これらは結局「消費者」と「提供者」という関係を再生産しただけとなり、「仏教思想の社会実装」「構造の改変」には繋がりませんでした。</p>
		<p class="interview-body space-top" use:floatUp>「寺院」という「場」のあり方も試行錯誤がありました。</p>
		<p class="interview-body" use:floatUp>日本で「寺院」と言うとすぐに「歴史・文化・風光明媚・観光」という連想が為されますが、我々はそうは考えません。「寺院」とは「仏教が存在する場」であり「仏教が学ばれ実践される場」であり「仏教思想が授受される場」だと考えます。歴史や文化財、風景なども素敵ではありますが、分けて考えるべきだと思っています。</p>
		<p class="interview-body" use:floatUp>そもそも「実験寺院」の旗艦である「寳幢寺」は西陣織の会社跡地です。庭も建物も歴史的仏像もない。歴史文化・観光資源は皆無です。歴史も観光資源も皆無の「お寺」に、関心と信頼を寄せていただくのは至難の業でした。</p>
		<p class="interview-body" use:floatUp>また、現代日本の普通の寺院は「住職一家が家庭生活を営む場」であることが普通だと思いますが、我々はこれも良しとはしていません。寺院に僧侶や関係者の生活の場があるのは当然ですが、「家族・関係者以外には閉じられている」のは本来の姿とは言えないと考えます。</p>
		<p class="interview-body" use:floatUp>しかし「全解放」を試した結果、一部のモラルのない人々の対応に、ただでさえ少ない人的リソースが消耗して酷いことになったケースもあり、これは現在でも難しい対応を迫られています。</p>
		<p class="interview-body" use:floatUp>様々なことを試した結果、最終的にたどり着いたのは「純粋にあり続ける」ということでした。</p>
		<p class="interview-body" use:floatUp>無理に方法を考えるのはやめて、自分たちがあるべき姿を純粋に表現し続けること。周囲・世間を信頼すること。これでダメだったら、我々はもう存在を拒否されているのだから、滅び去っても良い、いや、滅ぶべきなのかもしれない。そう考えて覚悟を決めました。</p>
		<p class="interview-body space-top" use:floatUp>実際に「もうダメだ」ということは何回もありました。普通に考えたら、生き延びているのが不思議なくらいです。しかしピンチの度に、多くの人の好意に支えられて今日までたどり着くことが出来ました。</p>
	</div>

	<div class="full-content put-image-right">
		<div class="description content">
			<h3 class="interview-subheading" use:floatUp>実験の今と次のステージ</h3>
			<p class="interview-body" use:floatUp>問い：実験寺院グループの今とこれからを教えて下さい</p>
			<p class="interview-body" use:floatUp>答え：現状、実験寺院寳幢寺には多くの起業家や経営者、また医師や学生などが来て下さるようになっています。我々が期待する「社会に実装された仏教の威力」が、多くの人々にも期待されるようになってきています。法人の経営も安定軌道に乗り始め、スタッフも徐々に拡充しつつあります。</p>
			<p class="interview-body" use:floatUp>しかし、「仏教を取り巻く社会構造の改変」にはまだまだ時間がかかりそうです。</p>
			<p class="interview-body" use:floatUp>残念ながら未だ「出家者」は私しかおりません。法人にも「もうひとりの出家者」を支えるだけの金銭的、人的リソースは足りていません。これからの課題です。</p>
			<p class="interview-body" use:floatUp>「場」としては「寳幢寺」に加えて、実験寺院の第二号「禅河院」をオープンさせることが出来ました。こちらは京都市内にある寳幢寺と違って、兵庫県の山間部に所在します。また違った活用法が出来るのもの期待しています。</p>
			<p class="interview-body" use:floatUp>この「実験寺院」の取り組みを通じて、多くの人々がこれまでの「宗教・儀礼」や「歴史文化・観光」という側面とはまた違った「仏教」に出会い、活用していただけるようになること。そして僧侶や寺院関係者もまた新たな可能性に意識が開いていくことを願ってやみません。</p>
		</div>

		<div class="image-wrapper-third content" use:floatUp>
			<EnhancedImage src={PhotoThird} alt='禅河院で思索する' />
		</div>
	</div>

	<div class="wide-content">
		<h3 class="interview-subheading" use:floatUp>
				協会から寄付のお願い：実験へのご参加を！
		</h3>
		<p class="interview-body space-top" use:floatUp>ありがたいことに、私たちの理念は多くの起業家、経営者などの皆様にご賛同いただき、法人の経営も安定軌道に乗り始めています。</p>
		<p class="interview-body" use:floatUp>しかし、構造の改変という目標を達成するためには、まだ大きな壁が立ちはだかっています。最大の課題は「理想的出家者」の数を増やせていないことです。</p>
		<p class="interview-body" use:floatUp>現在、実験寺院グループの出家者はひとりだけであり、法人にはまだ「次の出家者」を支えるだけの金銭的・人的リソースが不足しています。</p>
		<p class="interview-body" use:floatUp>同時に出家者をサポートし管理する在家のスタッフも足りていません。事務やプロジェクトマネージャーとして共に取り組む、新たな仲間の生活を支える給与を支払う余裕がありません。</p>
	</div>

	<div class="full-content put-image-left">
		<div class="image-wrapper-fourth content" use:floatUp>
			<EnhancedImage src={PhotoFourth} alt='禅河院外観' />
		</div>

		<div class="description content">
			<p class="interview-body space-top" use:floatUp>「日本仏教を、もう一度アップデートしたい。」 この挑戦の先にある、誰もが心豊かに生きられる社会を、一緒に作っていきませんか。</p>
			<p class="interview-body" use:floatUp>私たちは、皆様からのご支援を「儀礼」や「観光」等に対する「支払い」ではなく、「純粋な思想を社会に実装する」という「実験」への参加費用として受け取り、大切に使わせていただきます。</p>
			<p class="interview-body" use:floatUp>私たちが求めているのは、単なる「寄付金」ではありません。この壮大な社会実験を共に進める「共同責任者」です。</p>
			<p class="interview-body" use:floatUp>この「構造改変」の実験は、私たちだけの力では決して成し遂げられません。</p>
			<p class="interview-body" use:floatUp>「思想・哲学が弱体化した社会に、2500年の叡智を再び実装する」という壮大なミッションを共有し、共に未来を創造してくださる皆様のご支援が必要です。</p>
			<p class="interview-body" use:floatUp>ぜひ、この歴史的な一歩にご協力ください。</p>
	</div>
	</div>

	<div class="wide-content">
		<h3 class="interview-subheading" use:floatUp>【寄付の種類】</h3>
		<p class="interview-body" use:floatUp>単発でのご支援：皆様の可能な範囲でのご寄付を承ります。</p>
		<p class="interview-body" use:floatUp>月額寄付：出家者の持続的な生活基盤と安定した実験運営のため、継続的なご支援をお願いいたします。</p>
		<p class="interview-body" use:floatUp>プロジェクトベースの寄付：様々なプロジェクトに対してのご寄付を承ります。</p>
		<p class="interview-body" use:floatUp>使途指定月額サポート：若者支援など寄付金の使途を指定して、月額でサポート頂けます。</p>
		<p class="interview-body" use:floatUp>その他</p>

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
		margin-bottom: 24px;
		font-family: 'Noto Sans JP Medium', sans-serif;
		font-size: 24px;
	}

	.wide-content + .put-image-right {
		margin-top: 90px;
	}

	.description {
		font-family: var(--font-body-bold);
		text-align: left;
	}

	.description + .image-wrapper-first {
		margin-top: 44px;
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

	.position + .bio {
		margin-top: 44px;
	}

		.interview-subheading{
			padding-top: 150px;
			font-family: var(--font-heading-bold);
			font-size: 20px;
			line-height: 30px;
			letter-spacing: 0.06em;
		}

	.interview-body{
		font-family: var(--font-body);
		font-size: 16px;
		line-height: 30px;
		letter-spacing: 0.06em;
	}

	.interview-body.space-top{
		padding-top: 2em;
	}

	li{
		font-family: var(--font-body);
		font-size: 16px;
		line-height: 30px;
		letter-spacing: 0.06em;
	}

	@media screen and (width >= 768px) {
		.container {
			margin-top: 300px;
		}
	}

	@media screen and (width >= 1024px) {
		.put-image-right {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding-left: 95px;
			margin-top: 90px;
		}

		.put-image-right .interview-subheading{
			padding-top: 0;
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
		}

		.put-image-left{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding-top: 150px;
			padding-right: 95px;
		}

		.put-image-left .interview-subheading {
			padding-top: 0;
		}

		.image-wrapper-second{
			width: 460px;
			height: 684px;
			margin-left: 0;
		}

		.image-wrapper-second > :global(img){
			width: 100%;
			height: auto;
		}

		.image-wrapper-third{
			width: 464px;
			height: 696px;
			margin-right: 0;
		}

		.image-wrapper-third > :global(img){
			width: 100%;
			height: auto;
		}

		.image-wrapper-fourth{
			width: 540px;
			height: 435px;
			margin-left: 0;
		}

		.image-wrapper-fourth > :global(img){
			width: 100%;
			height: auto;
		}

		.image-wrapper-fourth + .description{
			padding-left: 20px;
		}
	}
</style>
