<script lang='ts'>
	import PhotoEngawa from '$lib/assets/temple/zengain_engawa-c.jpg';
	import PhotoGroup from '$lib/assets/temple/zengain_group-c.jpg';
	import PhotoIrori from '$lib/assets/temple/zengain_irori-c.jpg';
	import PhotoKaki from '$lib/assets/temple/zengain_kaki-c.jpg';
	import PhotoLecture from '$lib/assets/temple/zengain_lecture-c.jpg';
	import EnhancedImage from "$lib/components/ui/enhanced-image.svelte";
</script>

<div class="full-content wrapper">
	<div class="zenga-grid">
		<EnhancedImage src={PhotoGroup} alt='禅河院 集合写真' class='zenga-grid-group'/>
		<EnhancedImage src={PhotoEngawa} alt='縁側で' class='zenga-grid-engawa'/>
		<EnhancedImage src={PhotoKaki} alt='庭になる柿' class='zenga-grid-kaki'/>
		<EnhancedImage src={PhotoIrori} alt='囲炉裏で団欒' class='zenga-grid-irori'/>
		<EnhancedImage src={PhotoLecture} alt='講義の様子' class='zenga-grid-lecture'/>
	</div>
	<div class="description">
		<h3>禅河院</h3>
		<span class="zengain-label">Zenga-in</span>
		<p>所在：兵庫県西脇市</p>
		<p>築150年以上の古民家</p>
		<p>本尊：釈迦如来絵像・普賢菩薩絵像</p>
		<p class="space-top">実験寺院第二号で団体での研修や長期のリトリートなど、滞在型の企画に使用されています。</p>
		<p>田畑に囲まれた静かな集落に位置し、瞑想などに最高の環境です。</p>
	</div>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column-reverse;
		margin-top: 120px;
	}

	.zenga-grid {
		display: grid;
		grid-template-rows: auto auto auto;
		grid-template-columns: 317fr 65fr 179fr;
		gap: 10px;
		width: 100%;
		margin-top: 60px;
	}

	:global(.zenga-grid-group){
		grid-row: 1 / 2;
		grid-column: 1 / 4;
	}

	:global(.zenga-grid-engawa){
		grid-row: 2 / 3;
		grid-column: 1 / 3;
	}

	:global(.zenga-grid-kaki){
		grid-row: 2 / 3;
		grid-column: 3 / 4;
	}

	:global(.zenga-grid-irori){
		grid-row: 3 / 4;
		grid-column: 1 / 2;
	}

	:global(.zenga-grid-lecture){
		grid-row: 3 / 4;
		grid-column: 2 / 4;
	}

	.description {
		padding-right: 4%;
		padding-left: 4%;
	}

	h3 {
		font-family: var(--font-heading-bold);
		font-size: 25px;
		line-height: 30px;
		letter-spacing: 0.12em;
	}

	.zengain-label {
		font-family: var(--font-heading-bold);
		font-size: 13px;
		line-height: 24px;
		letter-spacing: 0.06em;
	}

	p {
		font-family: var(--font-body-bold);
		font-size: 11px;
		line-height: 24px;
		letter-spacing: 0.06em;
	}

	p.space-top {
		margin-top: 3em;
	}


	@media (width >= 1024px) {
		.wrapper {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			margin-top: 160px;
		}

		.zenga-grid {
			width: 579px;
			margin-top: 0;
		}

		.description {
			max-width: 390px;
			padding-right: 60px;
		}
	}
</style>