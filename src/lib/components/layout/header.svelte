<script lang="ts">
import { resolve } from '$app/paths'
import HeaderIcon from '$lib/assets/header-icon.svg'
import Logo from '$lib/assets/jba-black.png'
import DonationButton from '$lib/components/ui/donation-button.svelte'
import EnhancedImage from '$lib/components/ui/enhanced-image.svelte'
import * as v from 'valibot'

const FORM_LINK = 'https://docs.google.com/forms/d/e/1FAIpQLSf0uGXb31O_6tEKFbGLrcqyE6cODMMKL1clXQarhLaV0Yel9w/viewform?usp=dialog'

const HeaderMenuItem = v.object({
	href: v.pipe(v.string(), v.url()),
	isExternal: v.optional(v.boolean(), false),
	key: v.string(),
	label: v.string(),
})

type HeaderMenuItem = v.InferOutput<typeof HeaderMenuItem>

const MenuItems: HeaderMenuItem[] = [
	{
		href: '/#mission',
		isExternal: false,
		key: 'mission',
		label: 'mission',
	},
	{
		href: '/#company',
		isExternal: false,
		key: 'company',
		label: 'company',
	},
	{
		href: '/#works',
		isExternal: false,
		key: 'works',
		label: 'Works',
	},
	{
		href: '/#news',
		isExternal: false,
		key: 'pick-up',
		label: 'pick up',
	},
	{
		href: '/news/7bfa480blq',
		isExternal: false,
		key: 'faq',
		label: 'FAQ',
	},
] as const

let { isMenuOpen = $bindable(false) }: { isMenuOpen?: boolean } = $props()

function openMenu() {
	isMenuOpen = true
	document.body.style.overflow = 'hidden'
}

function closeMenu() {
	isMenuOpen = false
	document.body.style.overflow = ''
}

function handleKeydown(event: KeyboardEvent) {
	if (event.key === 'Escape' && isMenuOpen) {
		closeMenu()
	}
}

// 外部から isMenuOpen が変更された場合も overflow を同期
$effect(() => {
	document.body.style.overflow = isMenuOpen ? 'hidden' : ''
})
</script>

<svelte:window onkeydown={handleKeydown} />

<header class="header-container">
	<div class="header-wrapper">
		<a href={resolve('/')}>
			<EnhancedImage
				src={Logo}
				alt="日本仏教徒協会"
				class="logo"
				loading="eager"
				fetchpriority="high"
			/>
		</a>

		<!-- Mobile: hamburger menu -->
		<div class="mobile-controls">
			<button
				class="hamburger-button"
				onclick={openMenu}
				aria-label="メニューを開く"
				aria-expanded={isMenuOpen}
			>
				<span></span>
				<span></span>
				<span></span>
			</button>
		</div>

		<!-- Desktop navigation -->
		<nav class="list desktop-nav">
			{#each MenuItems as item (item.key)}
				<div class="link-wrapper">
					<a
						href={item.href}
						class="item-link"
					>
						{item.label}
					</a>
				</div>
			{/each}
			<DonationButton />
		</nav>
	</div>
</header>

<!-- Mobile menu overlay -->
<div
	class="menu-overlay"
	class:open={isMenuOpen}
>
	<div class="menu-header">
		<a href={resolve('/')}>
			<EnhancedImage
				src={Logo}
				alt="日本仏教徒協会"
				class="menu-logo"
				loading="eager"
			/>
		</a>
		<div class="menu-header-controls">
			<a
				class="contact-button"
				aria-label="お問い合わせ"
				href={FORM_LINK}
				target="_blank"
				rel="noopener noreferrer"
			>
				<img
					src={HeaderIcon}
					alt="お問合せフォーム"
				/>
			</a>
			<button
				class="close-button"
				onclick={closeMenu}
				aria-label="メニューを閉じる"
			>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M18 6L6 18M6 6L18 18"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
				</svg>
			</button>
		</div>
	</div>

	<nav class="menu-nav">
		{#each MenuItems as item, index (item.key)}
			<a
				href={item.href}
				class="menu-item"
				style="

--item-index: {index}"
				onclick={closeMenu}
			>
				{item.label.toUpperCase()}
			</a>
		{/each}
	</nav>
</div>

<style>
.header-container {
	position: sticky;
	top: 0;
	z-index: 100;
	width: 100%;
	background: #fff;
}

.header-wrapper {
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	max-width: 1200px;
	padding: 18px;
	margin: 0 auto;
}

/* EnhancedImage コンポーネント内の img に適用するため :global() を使用 */
:global(.logo) {
	max-width: 140px;
	height: auto;
}

/* Mobile controls */
.mobile-controls {
	display: flex;
	gap: 24px;
	align-items: center;
}

.contact-button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;
	padding: 0;
	cursor: pointer;
	background: transparent;
	border: none;
	transition: opacity 0.2s;
}

.contact-button:hover {
	opacity: 0.7;
}

.hamburger-button {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 28px;
	height: 20px;
	padding: 0;
	margin: -4px -4px -4px 0;
	cursor: pointer;
	background: transparent;
	border: none;
}

.hamburger-button span {
	display: block;
	width: 100%;
	height: 2px;
	background: #000;
	border-radius: 2px;
	transition: all 0.3s;
}

/* Navigation list styles */
.list {
	display: flex;
	flex-direction: row;
	gap: 1rem;
	align-items: center;
}

/* Desktop navigation - hidden on mobile */
.list.desktop-nav {
	display: none;
}

.item-link {
	font-family: 'Noto Sans JP', sans-serif;
	font-size: 14px;
	font-style: normal;
	font-weight: 500;
	line-height: 16px;
	color: var(--color-text);
	text-align: center;
	letter-spacing: 0.14em;
	white-space: nowrap;
	text-decoration: none;
}

.link-wrapper {
	width: max-content;
}

/* Mobile menu overlay */
.menu-overlay {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 200;
	visibility: hidden;
	width: 100%;
	height: 100vh;
	overflow-y: auto;
	background: var(--color-primary);
	opacity: 0;
	transition:
		opacity 0.3s ease,
		visibility 0.3s ease;
}

.menu-overlay.open {
	visibility: visible;
	opacity: 1;
}

.menu-header {
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 18px;
}

:global(.menu-logo) {
	max-width: 140px;
	height: auto;
	filter: brightness(0) invert(1);
}

.menu-header-controls {
	display: flex;
	gap: 24px;
	align-items: center;
}

.close-button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	padding: 0;
	margin: -4px -4px -4px 0;
	color: #fff;
	cursor: pointer;
	background: transparent;
	border: none;
	transition: opacity 0.2s;
}

.close-button svg {
	width: 28px;
	height: 28px;
}

.close-button:hover {
	opacity: 0.7;
}

.menu-overlay .contact-button img {
	border: 1px solid #fff;
	border-radius: 50%;
}

.menu-nav {
	display: flex;
	flex-direction: column;
	gap: 40px;
	align-items: flex-start;
	padding: 129px 60px 60px 18px;
}

.menu-item {
	font-family: Jost, 'Noto Sans JP', sans-serif;
	font-size: 24px;
	font-weight: 700;
	line-height: 1.2;
	color: #fff;
	text-align: left;
	letter-spacing: 0.015em;
	text-decoration: none;
	opacity: 0;
	transform: translateY(-20px);
	transition:
		opacity 0.4s ease,
		transform 0.4s ease;
}

.menu-item:hover {
	opacity: 0.8;
}

.menu-overlay.open .menu-item {
	opacity: 1;
	transform: translateY(0);
	transition-delay: calc(0.15s + var(--item-index) * 0.08s);
}

/* Desktop styles */
@media (width >= 1024px) {
	.header-container {
		position: sticky;
		top: 0;
	}

	.mobile-controls {
		display: none;
	}

	.list.desktop-nav {
		display: flex;
	}

	.menu-overlay {
		display: none;
	}

	.header-wrapper {
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 16px 40px;
	}

	:global(.logo) {
		max-width: 160px;
		margin: 0;
	}

	.list {
		gap: 18px;
		justify-content: flex-end;
		width: auto;
		padding: 0;
		overflow-x: visible;
	}

	.item-link {
		/* MISSION COMPANY WORKS NEWS DONATE */
		font-family: var(--font-heading-bold);
		font-size: 14px;
		line-height: 44px;
		text-transform: uppercase;

		/* identical to box height, or 314% */
		letter-spacing: 0.015em;
	}

	:global(.desktop-nav .cta-group) {
		flex: none;
	}
}
</style>
