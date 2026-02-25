<script lang="ts">
import Button from '$lib/assets/donation/button.png'
import Congrant from '$lib/assets/donation/congrant_logo_primary.png'
import EnhancedImage from '$lib/components/ui/enhanced-image.svelte'

const BASIC_DONATION = 'https://congrant.com/project/jba/16919'
</script>

<h3>クレジットカード、口座振替</h3>
<p>日本仏教徒協会の活動にご参与頂ける方は、まずはこちらの「基本のご寄付」からご参加下さい。</p>
<p>リンク先から「毎月の定額寄付」と「1回毎の寄付」がお選び頂けます。</p>
<div class="button-wrapper">
	<a
		href={BASIC_DONATION}
		target="_blank"
		rel="noopener noreferrer"
	>
		<EnhancedImage
			src={Button}
			alt="寄付ボタン"
			class="donation-button"
		/>
	</a>
</div>
<div class="footer">
	<div class="congrant-wrapper">
		<EnhancedImage
			src={Congrant}
			alt="コングラント"
		/>
	</div>
	<p class="congrant-description">
		Congrant (決済システム)より、クレジットカード、Google Pay、Apple Pay、PayPay、Amazon Pay、銀行振込、郵便振替に対応しています。
		<a
			href="https://congrant.com/jp/about.html"
			target="_blank"
			rel="noopener noreferrer"
		>
			＊Congrantとは
		</a>
	</p>
</div>

<style>
h3 {
	font-family: var(--font-body-bold);
	font-size: 24px;
	line-height: 1.6;
	margin-bottom: 24px;
}

p {
	font-family: var(--font-body);
	font-size: 14px;
	line-height: 30px;
	letter-spacing: 0.08em;
	color: #333;
}

.button-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
}

.button-wrapper a {
	transition: transform 0.2s ease-in;
}

.button-wrapper a:hover {
	transform: translateY(-4px);
}

p + .button-wrapper {
	margin-top: 40px;
}

:global(.donation-button) {
	filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.4));
}

.button-wrapper + .footer {
	margin-top: 130px;
}

.footer {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	row-gap: 38px;
}

.congrant-wrapper {
	width: 70%;
	height: auto;
}

.congrant-description {
	width: 100%;
	font-size: 12px;
	font-family: var(--font-body);
}

.congrant-description a {
	color: #0088ff;
}

@media screen and (width >= 1024px) {
	.footer {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		column-gap: 38px;
	}

	.congrant-wrapper {
		width: 150px;
		height: 32px;
	}

	.congrant-description {
		width: 50%;
	}
}
</style>
