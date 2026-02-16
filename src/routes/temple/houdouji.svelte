<script lang="ts">
	import { floatUp } from '$lib/actions';
	import Photo1000 from '$lib/assets/temple/1000.jpg';
	import PhotoGroup from '$lib/assets/temple/group_photo_2.jpg';
	import PhotoMeeting from '$lib/assets/temple/houdouji_meeting.jpg';
	import EnhancedImage from "$lib/components/ui/enhanced-image.svelte";
</script>
<div class="full-content wrapper">
	<div class="description">
		<h2 use:floatUp>施設紹介</h2>
		<span class="facility-label" use:floatUp>About Facility</span>
		<h3 use:floatUp>寳幢寺</h3>
		<span class="houdouji-label" use:floatUp>Houdou-ji</span>
		<p use:floatUp>所在：京都府京都市</p>
		<p use:floatUp>西陣織の会社・工場跡地をお借りして運営</p>
		<p use:floatUp>本尊：仏舎利如意宝珠・不動明王座像</p>
		<p class="space-top" use:floatUp>実験寺院の第一号で旗艦寺院です。</p>
		<p use:floatUp>数多くの企業経営者、起業家、学生などが訪れ、日々仏教思想の社会実装が行われています。</p>
	</div>

	<div>
		<div class="houdouji-grid">
			<div class="houdouji-grid-meeting" use:floatUp>
				<EnhancedImage src={PhotoMeeting} alt='ミーティング' />
			</div>
			<div class="houdouji-grid-group" use:floatUp>
				<EnhancedImage src={PhotoGroup} alt='集合写真' />
			</div>
			<div class="houdouji-grid-meals" use:floatUp>
				<EnhancedImage src={Photo1000} alt='1000人ミールス' />
			</div>
		</div>
	</div>
</div>

<style>
	.wrapper {
		margin-top: 120px;
	}

	.description {
		padding-right: 4%;
		padding-left: 4%;
	}

	h2 {
		font-family: var(--font-heading-bold);
		font-size: 25px;
		line-height: 30px;
		letter-spacing: 0.12em;
	}

	h3 {
		font-family: var(--font-heading-bold);
		font-size: 25px;
		line-height: 30px;
		letter-spacing: 0.12em;
	}

	.facility-label {
		font-family: var(--font-heading-bold);
		font-size: 13px;
		line-height: 24px;
		letter-spacing: 0.06em;
	}

	.facility-label + h3 {
		margin-top: 112px;
	}

	.houdouji-label {
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

	.houdouji-label + p {
		margin-top: 24px;
	}

	.houdouji-grid {
		display: grid;
		grid-template-rows: auto auto;
		grid-template-columns: 276fr 309fr;
		gap: 10px;
		width: 100%;
		margin-top: 60px;
	}

	.houdouji-grid-meeting {
		grid-row: 1 / 2;
		grid-column: 1 / 3;
	}

	.houdouji-grid > div > :global(img) {
		width: 100%;
		height: auto;
	}

	@media (width >= 1024px) {
		.wrapper {
			display: flex;
			flex-direction: row;
			justify-content: flex-end;
			margin-top: 246px;
		}

		.description {
			max-width: 390px;
			margin-right: 94px;
			margin-left: 60px;
		}

		.houdouji-grid {
			width: 595px;
			margin-top: 0;
		}
	}
</style>