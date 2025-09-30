<script lang="ts">
	import { resolve } from "$app/paths";
	import Logo from "$lib/assets/jba-black.png";
	import * as v from "valibot";

	const HeaderMenuItem = v.object({
		href: v.pipe(v.string(), v.url()),
		isExternal: v.optional(v.boolean(), false),
		key: v.string(),
		label: v.string(),
	});

	type HeaderMenuItem = v.InferOutput<typeof HeaderMenuItem>;

	const MenuItems: HeaderMenuItem[] = [
		{
			href: "/",
			isExternal: false,
			key: "top",
			label: "Top",
		},
		{
			href: "/exprimental-temple",
			isExternal: false,
			key: "experimental-temple",
			label: "実験寺院寳幢寺",
		},
		{
			href: "/mission",
			isExternal: false,
			key: "mission",
			label: "Mission",
		},
		{
			href: "/works",
			isExternal: false,
			key: "works",
			label: "Works",
		},
		{
			href: "/news",
			isExternal: false,
			key: "news",
			label: "News",
		},
		{
			href: "/donate",
			isExternal: false,
			key: "donate",
			label: "Donate",
		},
		{
			href: "/access",
			isExternal: false,
			key: "access",
			label: "アクセス",
		},
		{
			href: "https://samgha.square.site/",
			isExternal: true,
			key: "events",
			label: "イベント",
		},
	];
</script>

<header class="header-container">
	<div class="header-wrapper">
		<a href={resolve("/")}>
			<img src={Logo} alt="日本仏教徒協会" class="logo" />
		</a>

		<nav class="list">
			{#each MenuItems as item (item.key)}
				<div class="link-wrapper">
					<a href={resolve(item.href)} class="item-link">
						{item.label}
					</a>
				</div>
			{/each}
		</nav>
	</div>
</header>

<style>
	.header-container {
		width: 100%;
		background: #fff;
		box-shadow: 0 4px 4px rgb(0 0 0 / 8%);
	}

	.header-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
	}

	.logo {
		max-width: 200px;
	}

	.list {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		padding-right: 1.5rem;
		padding-bottom: 0.5rem;
		padding-left: 1.5rem;
		overflow-x: scroll
	}

	.list > * + * {
		margin-left: 1rem;
	}

	.item-link {
		font-family: "Noto Sans JP", sans-serif;
		font-size: 12px;
		font-style: normal;
		font-weight: 500;
		line-height: 16px;
		color: #000;
		text-align: center;
		letter-spacing: 0.14em;
		text-decoration: none;
	}

	.link-wrapper {
		width: max-content;
		text-wrap-mode: nowrap;
	}

	@media (width >= 768px) {
		.header-wrapper {
			flex-direction: row;
			justify-content: flex-end;
		}

		.list {
			justify-content: end;
			padding-bottom: 0%;
		}
	}
</style>
