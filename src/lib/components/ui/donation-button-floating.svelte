<script lang="ts">
import { resolve } from '$app/paths'

let { menuOpen = false, onclick }: { menuOpen?: boolean; onclick?: () => void } = $props()
</script>

<a
	href={resolve('/donation')}
	class="donation-button-floating"
	class:menu-open={menuOpen}
	aria-label="寄付ページへ移動"
	{onclick}
>
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="currentColor"
		aria-hidden="true"
	>
		<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
	</svg>
	<span>寄付をする</span>
</a>

<style>
.donation-button-floating {
	position: fixed;
	right: 24px;
	bottom: 24px;
	z-index: 250;
	display: flex;
	gap: 8px;
	align-items: center;
	padding: 12px 20px;
	font-family: 'Noto Sans JP', sans-serif;
	font-size: 14px;
	font-weight: 500;
	color: #fff;
	text-decoration: none;
	background-color: var(--color-primary);
	border: 1px solid rgb(192 235 245 / 50%);
	border-radius: 30px;
	box-shadow:
		0 4px 12px rgb(0 0 0 / 15%),
		0 2px 4px rgb(0 0 0 / 10%);
	transition:
		background-color 0.3s,
		color 0.3s,
		box-shadow 0.3s;
}

.donation-button-floating:hover {
	box-shadow:
		0 6px 16px rgb(0 0 0 / 20%),
		0 3px 6px rgb(0 0 0 / 12%);
}

.donation-button-floating svg {
	flex-shrink: 0;
}

/* メニュー展開時: 白背景に反転 */
.donation-button-floating.menu-open {
	color: var(--color-primary);
	background-color: #fff;
}

/* デスクトップでは非表示 */
@media (width >= 1024px) {
	.donation-button-floating {
		display: none;
	}
}
</style>
