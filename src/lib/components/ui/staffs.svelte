<script lang="ts">
	import type { Staff } from "$lib/typing";

	import { inView } from "motion";
	import { animate } from "motion/mini";
	import { onMount } from "svelte";

	let tbodyElement: HTMLTableSectionElement;
	let rowElements: HTMLTableRowElement[] = [];

	const staffs: Staff[] = [
		{
			name: "松波さゆり",
			nameRomaji: "Sayuri Matsunami",
			position: "スタッフ",
		},
		{
			name: "平井和美",
			nameRomaji: "Kazumi Hirai",
			position: "スタッフ",
		},
		{
			name: "加藤諒佑",
			nameRomaji: "Ryosuke Katou",
			position: "スタッフ",
		},
	];

	onMount(() => {
		// 初期状態: 透明 + 左に13pxオフセット
		for (const row of rowElements) {
			row.style.opacity = "0";
			row.style.transform = "translateX(-13px)";
		}

		// tbody全体を監視
		const stopObserver = inView(
			tbodyElement,
			() => {
				// 進入時: stagger付きで各行をアニメーション
				for (const [index, row] of rowElements.entries()) {
					animate(
						row,
						{ opacity: 1, transform: "translateX(0)" },
						{ delay: index * 0.1, duration: 0.6, ease: "easeOut" },
					);
				}

				// 退出時: 逆再生
				return () => {
					for (const [index, row] of rowElements.entries()) {
						animate(
							row,
							{ opacity: 0, transform: "translateX(-13px)" },
							{
								delay: index * 0.1,
								duration: 0.4,
								ease: "easeOut",
							},
						);
					}
				};
			},
			{ amount: 0.5 },
		);

		return () => {
			stopObserver();
		};
	});
</script>

<h3 class="text-medium section-header-japanese">日本仏教徒協会_運営メンバー</h3>

<table>
	<tbody bind:this={tbodyElement}>
		{#each staffs as staff, index (staff.nameRomaji)}
			<tr bind:this={rowElements[index]}>
				<td>{staff.position}</td>
				<td>{staff.name}<br />{staff.nameRomaji}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		margin: 26px 0 0;
		font-family: var(--font-gothic-bold);
		font-size: 13px;
		line-height: 19px;
		color: #000;
		letter-spacing: 0.06em;
		border: none;
	}

	td {
		vertical-align: top;
		text-align: left;
		border: none;
	}

	table tr td {
		padding: 0 1rem 0 0;
	}

	table tr:nth-child(n + 2) td {
		padding-top: 13px;
	}

	tr {
		will-change: transform, opacity;
	}
</style>
