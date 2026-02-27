<script lang="ts">
interface Properties {
	href: string
	label: string
}

const { href, label }: Properties = $props()
</script>

<a
	{href}
	class="donation-button"
	target="_blank"
	rel="noopener noreferrer"
>
	<span class="icon-wrapper">
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
		</svg>
	</span>
	<span class="label">{label}</span>
</a>

<style>
.donation-button {
	--button-color: #f4875f;

	display: inline-flex;
	gap: 12px;
	align-items: center;
	justify-content: center;
	width: 100%;
	max-width: 400px;
	padding: 12px 32px 12px 12px;
	font-family: 'Noto Sans JP', sans-serif;
	font-size: 16px;
	font-weight: 500;
	color: #fff;
	text-decoration: none;
	background-color: var(--button-color);
	border: 2px solid var(--button-color);
	border-radius: 50px;
	transition:
		background-color 0.2s,
		color 0.2s;
}

.donation-button:hover {
	color: var(--button-color);
	background-color: #fff;
}

.icon-wrapper {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	color: var(--button-color);
	background-color: #fff;
	border-radius: 50%;
	transition: color 0.2s;
}

.donation-button:hover .icon-wrapper {
	color: #fff;
	background-color: var(--button-color);
}

.label {
	flex: 1;
	text-align: center;
}
</style>
