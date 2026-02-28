<script lang="ts">
import type { Director } from '$lib/typing.d.ts'

import { resolve } from '$app/paths'
import { floatUp } from '$lib/actions'
import EnhancedImage from '$lib/components/ui/enhanced-image.svelte'
import Link from '$lib/components/ui/link.svelte'

let { affiliation, bio, href, imageUrl, name, nameRomaji, position, reversed = false }: Director = $props()
</script>

<div class={['member-card', reversed && 'reversed']}>
	{#if imageUrl}
		<div
			class="image"
			use:floatUp
		>
			<EnhancedImage
				src={imageUrl}
				alt={name}
			/>
		</div>
	{/if}

	<div
		class="description"
		use:floatUp
	>
		<p class="position">{position}</p>
		<h3 class="name">{name}</h3>
		<p class="name-romaji">{nameRomaji}</p>
		<p class="affiliation">{affiliation}</p>
		<p class="bio">{bio}</p>

		{#if href}
			<div
				class="link"
				use:floatUp
			>
				<Link
					href={resolve(href)}
					textContent="VIEW MORE"
				/>
			</div>
		{/if}
	</div>
</div>

<style>
.member-card {
	padding: 0;
	margin: 95px auto 0;
}

.image {
	width: 512px;
	max-width: 100%;
	height: auto;
	aspect-ratio: 512 / 312;
	overflow: hidden;
	transform-origin: center center;
	will-change: transform;
}

.image :global(img) {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.description {
	padding-top: 24px;
	font-family: var(--font-body-bold);
	text-align: left;
}

.position {
	/* 代表理事 */
	margin: 0;
	font-family: var(--font-body-bold);
	font-size: 14px;
	line-height: 19px;
	color: #000;
	letter-spacing: 0.06em;
}

.name {
	/* 藏本龍介 */
	margin: 13px auto 0;
	font-family: var(--font-body-bold);
	font-size: 25px;
	line-height: 36px;
	color: #000;
	letter-spacing: 0.12em;
}

.name-romaji {
	/* Kuramoto Ryosuke */
	font-family: var(--font-body-bold);
	font-size: 14px;
	line-height: 16px;
	color: #000;
	letter-spacing: 0.06em;
}

.affiliation {
	/* 東京大学東洋文化研究所・教授 */
	margin: 13px auto 0;
	font-family: var(--font-body-bold);
	font-size: 14px;
	line-height: 24px;
	color: #000;
	letter-spacing: 0.06em;
}

.bio {
	/* 1979年生まれ... */
	margin: 14px auto 0;
	font-family: var(--font-body);
	font-size: 14px;
	line-height: 24px;
	color: #000;
	letter-spacing: 0.06em;
}

.link {
	margin-top: 44px;
}

@media (width >= 1024px) {
	.member-card {
		display: flex;
		flex-direction: row-reverse;
		column-gap: 60px;
		align-items: flex-start;
		justify-content: space-between;
		width: 100%;
	}

	.member-card.reversed {
		flex-direction: row;
	}

	/* image, descriptionはmember-cardの子要素 */
	.image {
		flex-basis: 512px;
		width: 512px;
		height: 312px;
		overflow: hidden;
		transform-origin: center center;
		will-change: transform;
	}

	.image :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.description {
		flex-shrink: 0;
		flex-basis: 390px;
	}
}
</style>
