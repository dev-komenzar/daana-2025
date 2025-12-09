<script lang="ts">
	import type { Director } from "$lib/typing.d.ts";

	import PhotoYamasaki from "$lib/assets/DSC02542-converted.jpeg";
	import PhotoKuramoto from "$lib/assets/kuramoto-sample.jpg";
	import DirectorCard from "$lib/components/ui/director-card.svelte";

	const directors: Director[] = [
		{
			affiliation: "東京大学東洋文化研究所・准教授",
			bio: "1979年生まれ。福岡県出身。東京大学教養学部卒業、同大大学院総合文化研究科博士課程単位取得退学。博士(学術)・専門は文化人類学。2006年からミャンマーで出家を含む現地調査を行う。2015年から実験寺院・寳幢寺の設立準備・運営に関わる。著書に「世俗を生きる出家者たち」(法蔵館)、Living with the Vinaya(University of Hawaii Press)など。新著『仏教を「経営」する』(NHK出版)では、ミャンマーの２つの寺院及び寳幢寺を事例として、現代社会における仏教の可能性について検討している。",
			imageUrl: PhotoKuramoto,
			name: "藏本龍介",
			nameRomaji: "Kuramoto Ryosuke",
			position: "代表理事",
		},
		{
			affiliation: "株式会社ピルグリマージュジャパン代表。",
			bio: "京都大学経営管理大学院修了(観光経営科学)。三井物産、ALLSAINTS JAPAN代表取締役、ビームス上席執行役員を経て独立。2022年、四国遍路を満願した経験から、地方に眠る豊な文化と、そこにある静かな課題に深く心を動かされる。かつては世界を舞台にファッションビジネスを手がけ、都市とグローバル経済の最前線で生きてきたが、今は”歩く旅”という最も原始的な行為の中に、人と人、そして人と地域を再び結び直す力を見出している。「日本の地方経済を豊かにする」ことを目標に掲げ、四国遍路をはじめとする巡礼文化の継承と、そこに関わる人々の営みを未来へとつなぐ活動に取り組む。",
			imageUrl: PhotoYamasaki,
			name: "山﨑 元",
			nameRomaji: "Yamazaki Gen",
			position: "代表理事",
		},
	];
</script>

<div>
	{#each directors as member (member.name)}
		<DirectorCard
			affiliation={member.affiliation}
			bio={member.bio}
			name={member.name}
			nameRomaji={member.nameRomaji}
			position={member.position}
			imageUrl={member.imageUrl}
		/>
	{/each}
</div>
