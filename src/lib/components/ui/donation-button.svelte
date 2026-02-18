<script lang="ts">
import { resolve } from '$app/paths'

const FORM_LINK = 'https://docs.google.com/forms/d/e/1FAIpQLSeybsspD3fochhGeqD4mQvkGNrdDcYXxBxw893GTe9WRjS4tQ/viewform?usp=publish-editor'
</script>

<div class="cta-group">
	<a
		href={resolve('/donation')}
		class="donation-button"
		aria-label="寄付ページへ移動"
	>
		<span class="icon-wrapper">
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="currentColor"
				aria-hidden="true"
			>
				<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
			</svg>
		</span>
		<span>寄付をする</span>
	</a>
	<a
		href={FORM_LINK}
		class="contact-icon-wrapper"
		aria-label="お問い合わせ"
		target="_blank"
		rel="noopener noreferrer"
	>
		<svg
			width="20"
			height="16"
			viewBox="0 0 20 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<path
				d="M1 15V1H19V15H1Z"
				fill="white"
			/>
			<path
				d="M1 1V15M1 1H19M1 1L7.75 8M1 15H19M1 15L7.75 8M19 15V1M19 15L12.25 8M19 1L12.25 8M7.75 8L10 10.3333L12.25 8"
				stroke="#16212F"
				stroke-width="2"
				stroke-linejoin="round"
			/>
		</svg>
	</a>
</div>

<style>
.cta-group {
	display: flex;
	gap: 3px;
	align-items: stretch;
}

.donation-button {
	display: inline-flex;
	gap: 10px;
	align-items: center;
	width: fit-content;
	padding: 8px 16px 8px 8px;
	font-family: 'Noto Sans JP', sans-serif;
	font-size: 13px;
	font-weight: 500;
	color: #fff;
	text-decoration: none;
	white-space: nowrap;
	background-color: var(--color-primary);
	border-radius: 24px 0 0 24px;
	transition:
		background-color 0.2s,
		opacity 0.2s;
}

.donation-button:hover {
	opacity: 0.85;
}

.icon-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	color: var(--color-primary);
	background-color: #fff;
	border-radius: 50%;
}

.icon-wrapper svg {
	flex-shrink: 0;
}

.contact-icon-wrapper {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 50px;
	padding-left: 10px;
	background-color: #fff;
	border: 2px solid var(--color-primary);
	border-radius: 0 50% 50% 0;
	transition: opacity 0.2s;
}

.contact-icon-wrapper:hover {
	opacity: 0.7;
}

.contact-icon-wrapper svg {
	flex-shrink: 0;
}
</style>
