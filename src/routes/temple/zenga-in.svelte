<script lang='ts'>
	import { floatUp } from '$lib/actions';
	import PhotoEngawa from '$lib/assets/temple/zengain_engawa-c.jpg';
	import PhotoGroup from '$lib/assets/temple/zengain_group-c.jpg';
	import PhotoIrori from '$lib/assets/temple/zengain_irori-c.jpg';
	import PhotoKaki from '$lib/assets/temple/zengain_kaki-c.jpg';
	import PhotoLecture from '$lib/assets/temple/zengain_lecture-c.jpg';
	import EnhancedImage from "$lib/components/ui/enhanced-image.svelte";
</script>

<div class="full-content wrapper">
	<div class="zenga-grid">
		<div class="zenga-grid-group" use:floatUp>
			<EnhancedImage src={PhotoGroup} alt='禅河院 集合写真' />
		</div>
		<div class="zenga-grid-engawa" use:floatUp>
			<EnhancedImage src={PhotoEngawa} alt='縁側で' />
		</div>
		<div class="zenga-grid-kaki" use:floatUp>
			<EnhancedImage src={PhotoKaki} alt='庭になる柿' />
		</div>
		<div class="zenga-grid-irori" use:floatUp>
			<EnhancedImage src={PhotoIrori} alt='囲炉裏で団欒' />
		</div>
		<div class="zenga-grid-lecture" use:floatUp>
			<EnhancedImage src={PhotoLecture} alt='講義の様子' />
		</div>
	</div>
	<div class="description">
		<h3 use:floatUp>禅河院</h3>
		<span class="zengain-label" use:floatUp>Zenga-in</span>
		<p use:floatUp>所在：兵庫県西脇市</p>
		<p use:floatUp>築150年以上の古民家</p>
		<p use:floatUp>本尊：釈迦如来絵像・普賢菩薩絵像</p>
		<p class="space-top" use:floatUp>実験寺院第二号で団体での研修や長期のリトリートなど、滞在型の企画に使用されています。</p>
		<p use:floatUp>田畑に囲まれた静かな集落に位置し、瞑想などに最高の環境です。</p>
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

	.zenga-grid-group {
		grid-row: 1 / 2;
		grid-column: 1 / 4;
	}

	.zenga-grid-engawa {
		grid-row: 2 / 3;
		grid-column: 1 / 3;
	}

	.zenga-grid-kaki {
		grid-row: 2 / 3;
		grid-column: 3 / 4;
	}

	.zenga-grid-irori {
		grid-row: 3 / 4;
		grid-column: 1 / 2;
	}

	.zenga-grid-lecture {
		grid-row: 3 / 4;
		grid-column: 2 / 4;
	}

	.zenga-grid > div > :global(img) {
		width: 100%;
		height: auto;
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
			justify-content: flex-start;
			margin-top: 160px;
		}

		.zenga-grid {
			width: 579px;
			margin-top: 0;
		}

		.description {
			max-width: 390px;
			padding-right: 60px;
			padding-left: 72px;
		}
	}
</style>