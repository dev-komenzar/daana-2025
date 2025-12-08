<script lang="ts">
	import type { Member } from "$lib/typing.d.ts";

	let { affiliation, bio, imageUrl, name, nameRomaji, position }: Member =
		$props();
</script>

<div class={["member-card"]}>
	<img src={imageUrl} alt={name} class="image" />

	<div class="description">
		<p class="position">{position}</p>
		<h3 class="name">{name}</h3>
		<p class="name-romaji">{nameRomaji}</p>
		<p class="affiliation">{affiliation}</p>
		<p class="bio">{bio}</p>
	</div>
</div>

<style>
	.member-card {
		padding: 0;
		margin: 95px auto 0;
	}

	.image {
		width: 512px;
		height: 312px;
		aspect-ratio: 512 / 312;
		object-fit: cover;
		transition: transform 0.3s ease-in-out;
	}

	.description {
		font-family: var(--font-gothic-bold);
		text-align: left;
	}

	.member-card:hover .image {
		transform: scale(1.02);
	}

	.position {
		/* 代表理事 */
		margin: 0;
		font-family: var(--font-gothic-bold);
		font-size: 13px;
		line-height: 19px;
		color: #000;
		letter-spacing: 0.06em;
	}

	.name {
		/* 藏本龍介 */
		margin: 13px auto 0;
		font-family: var(--font-gothic-bold);
		font-size: 25px;
		line-height: 48px;
		color: #000;
		letter-spacing: 0.12em;
	}

	.name-romaji {
		/* Kuramoto Ryosuke */
		font-family: var(--font-gothic-bold);
		font-size: 13px;
		line-height: 24px;
		color: #000;
		letter-spacing: 0.06em;
	}

	.affiliation {
		/* 東京大学東洋文化研究所・准教授 */
		margin: 6px auto 0;
		font-family: var(--font-gothic-bold);
		font-size: 13px;
		line-height: 24px;
		color: #000;
		letter-spacing: 0.06em;
	}

	.bio {
		/* 1979年生まれ... */
		margin: 14px auto 0;
		font-family: var(--font-gothic-bold);
		font-size: 11px;
		line-height: 24px;
		color: #000;
		letter-spacing: 0.06em;
	}

	@media (width >= 768px) {
		.member-card {
			display: flex;
			flex-direction: row-reverse;
			column-gap: 60px;
			align-items: flex-start;
		}

		/* image, descriptionはmember-cardの子要素 */
		.image {
			flex-basis: 512px;
		}

		.description {
			flex-basis: 390px;
		}
	}
</style>
