<script lang="ts">
import Congrant from '$lib/assets/donation/congrant_logo_primary.png'
import EnhancedImage from '$lib/components/ui/enhanced-image.svelte'

import DonationButton from './button.svelte'

const BASIC_DONATION = 'https://congrant.com/project/jba/16919'
const WISHLIST = 'https://www.amazon.co.jp/hz/wishlist/ls/1I838ZANZ4SLQ?ref_=wl_share'
</script>

<h3>クレジットカード、口座振替</h3>
<p>日本仏教徒協会の活動にご参与頂ける方は、まずはこちらの「基本のご寄付」からご参加下さい。</p>
<p>リンク先から「毎月の定額寄付」と「1回毎の寄付」がお選び頂けます。</p>
<div class="button-wrapper">
	<DonationButton
		href={BASIC_DONATION}
		label="ご寄付はこちらから"
	/>
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
<div class="devider">
	<span class="devider-bar"></span>
</div>
<h3>物品のご寄付</h3>
<p>法会や修行などで使われる供物や、必要な備品などを掲載しております。</p>
<p>Amazonのウィッシュリストから直接ご寄付頂くことが出来ます。</p>
<div class="button-wrapper">
	<DonationButton
		href={WISHLIST}
		label="WISHLISTを見る"
	/>
</div>

<style>
h3 {
	margin-bottom: 24px;
	font-family: var(--font-body-bold);
	font-size: 24px;
	line-height: 1.6;
}

p {
	font-family: var(--font-body);
	font-size: 14px;
	line-height: 30px;
	color: #333;
	letter-spacing: 0.08em;
}

.button-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
}

p + .button-wrapper {
	margin-top: 40px;
}

:global(.donation-button) {
	filter: drop-shadow(0 4px 4px rgb(0 0 0 / 40%));
}

.button-wrapper + .footer {
	margin-top: 130px;
}

.footer {
	display: flex;
	flex-direction: column;
	row-gap: 38px;
	align-items: center;
	justify-content: center;
}

.congrant-wrapper {
	width: 70%;
	height: auto;
}

.congrant-description {
	width: 100%;
	font-family: var(--font-body);
	font-size: 12px;
}

.congrant-description a {
	color: #08f;
}

.devider {
	margin-top: 100px;
	margin-bottom: 100px;

	width: 100%;
	height: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.devider-bar {
	display: block;
	width: 88px;
	height: 2px;
	background-color: #1e1e1e;
}

@media screen and (width >= 1024px) {
	.footer {
		display: flex;
		flex-direction: row;
		column-gap: 38px;
		align-items: center;
		justify-content: center;
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
