<script lang="ts">
import Button from '$lib/assets/donation/wishlist_button.png'
import EnhancedImage from '$lib/components/ui/enhanced-image.svelte'

const LINK = 'https://www.amazon.co.jp/hz/wishlist/ls/1I838ZANZ4SLQ?ref_=wl_share'
</script>

<div
	id="wishlist"
	class="header"
>
	<span class="bar"></span>
	<div class="header-wrapper">
		<span class="icon">
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
			>
				<rect
					x="3"
					y="3"
					width="18"
					height="18"
					rx="2"
					fill="currentColor"
				/>
				<path
					d="M9 12l2 2 4-4"
					stroke="white"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<h3>物品のご寄付</h3>
		</span>
	</div>
</div>

<div class="body">
	<h4>WISH LIST</h4>
	<span class="note-amazon">[Amazonに掲載]</span>
	<p>法会や修行などで使われる供物や、必要な備品などを掲載しております。</p>
	<p>Amazonのウィッシュリストから直接ご寄付頂くことが出来ます。</p>

	<a
		class="button"
		href={LINK}
		target="_blank"
		rel="noopener noreferrer"
	>
		<EnhancedImage
			src={Button}
			alt="ウィッシュリストへのリンク"
		/>
	</a>
</div>

<style>
.header {
	width: 100%;
	height: 104px;
	background-color: #fff;
}

.bar {
	display: block;
	width: 100%;
	height: 6px;
	background: #c0ebf5;
}

.header-wrapper {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
}

.icon {
	display: flex;
	align-items: center;
	justify-content: center;
	color: #c0ebf5;
}

h3 {
	font-family: var(--font-heading-bold);
	font-size: 20px;
	line-height: 24px;
	color: black;
	letter-spacing: 0.06em;
}

.body {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	padding: 100px 4% 90px;
	background-color: #fff;
}

#wishlist + .body {
	margin-top: 6px;
}

h4 {
	font-family: var(--font-body-bold);
	font-size: 26px;
	line-height: 30px;
	letter-spacing: 0.08em;
}

.note-amazon {
	font-family: var(--font-body);
	font-size: 13px;
	line-height: 30px;
	letter-spacing: 0.08em;
}

.note-amazon + p {
	margin-top: 34px;
}

p {
	font-family: var(--font-body);
	font-size: 14px;
	line-height: 30px;
	letter-spacing: 0.08em;
}

.button {
	display: block;
	width: 149px;
	height: 26px;
	transition: transform 0.2s ease-in;
}

.button:hover {
	transform: translateY(-4px);
}

p + .button {
	margin-top: 74px;
}
</style>
