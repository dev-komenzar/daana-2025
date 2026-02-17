<script lang="ts">
import type { Staff } from '$lib/typing'

import { floatUp } from '$lib/actions'

const staffs: Staff[] = [
	{
		name: '松波さゆり',
		nameRomaji: 'Sayuri Matsunami',
		position: 'スタッフ',
	},
	{
		name: '平井和美',
		nameRomaji: 'Kazumi Hirai',
		position: 'スタッフ',
	},
	{
		name: '加藤諒佑',
		nameRomaji: 'Ryosuke Kato',
		position: 'スタッフ',
	},
]
</script>

<h3
	class="text-medium section-header-japanese"
	use:floatUp
>
	日本仏教徒協会_運営メンバー
</h3>

<table>
	<tbody>
		{#each staffs as staff (staff.nameRomaji)}
			<tr use:floatUp>
				<td>{staff.position}</td>
				<td>{staff.name}<br />{staff.nameRomaji}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
table {
	margin: 26px 0 0;
	font-family: var(--font-body-bold);
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
