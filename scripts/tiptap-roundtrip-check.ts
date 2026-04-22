import { Color } from '@tiptap/extension-color'
import { Image } from '@tiptap/extension-image'
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import { TextAlign } from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { generateHTML, generateJSON } from '@tiptap/html/server'
import { StarterKit } from '@tiptap/starter-kit'
import { resolve } from 'node:path'

import { loadDotenv } from './lib/env'
import { createMicrocmsClient, fetchAllNews } from './lib/microcms'

/**
 * daana-cn7.3: microCMS 既存 news 本文 HTML を TipTap で parse → render round-trip し、
 * 「意味的に同一」(= TipTap JSON レベルで idempotent) であることを検証する。
 *
 * 評価軸は 2 つ:
 *   - roundTripLossless: JSON(original) === JSON(render(JSON(original))).
 *     TipTap が自身の出力を再入力したとき同じ JSON に戻るか = 編集 UI での safety.
 *   - parseLossless:     normalize(original) === normalize(render(JSON(original))).
 *     原文と TipTap 出力の HTML を正規化して比較。差分は parse 時の情報落ち
 *     (figure 等のサポート外構文) を検知する。
 *
 * AC: 全件 roundTripLossless。parseLossless の失敗はエクステンション拡張
 * (daana-ajs.12 heading-id / daana-ajs.13 figure+figcaption 等) でカバーされる予定。
 */

const EXTENSIONS = [StarterKit, TextAlign.configure({ types: ['heading', 'paragraph'] }), TextStyle, Color, Image, Table, TableRow, TableHeader, TableCell]

type RoundTripResult = {
	id: string
	parseLossless: boolean
	parsePreview?: { original: string; rendered: string }
	roundTripLossless: boolean
	title: string
}

async function main(): Promise<void> {
	loadDotenv(resolve(process.cwd(), '.env'))
	const apiKey = process.env.MICROCMS_API_KEY
	if (!apiKey) throw new Error('MICROCMS_API_KEY is required in .env')

	const client = createMicrocmsClient({ apiKey })
	const news = await fetchAllNews(client, { fields: ['id', 'title', 'content'] })
	console.log(`Fetched ${news.length} news items`)

	const results: RoundTripResult[] = []
	for (const item of news) {
		const original = item.content ?? ''
		if (!original) {
			results.push({ id: item.id, parseLossless: true, roundTripLossless: true, title: item.title ?? '' })
			continue
		}
		const json1 = generateJSON(original, EXTENSIONS)
		const rendered = generateHTML(json1, EXTENSIONS)
		const json2 = generateJSON(rendered, EXTENSIONS)

		const roundTripLossless = JSON.stringify(json1) === JSON.stringify(json2)
		const normOriginal = normalize(original)
		const normRendered = normalize(rendered)
		const parseLossless = normOriginal === normRendered

		results.push({
			id: item.id,
			parseLossless,
			parsePreview: parseLossless ? undefined : { original: normOriginal, rendered: normRendered },
			roundTripLossless,
			title: item.title ?? '',
		})
	}

	const roundTripPass = results.filter(r => r.roundTripLossless).length
	const parsePass = results.filter(r => r.parseLossless).length
	console.log(`\n==== roundTrip lossless (AC): ${roundTripPass}/${results.length} ====`)
	console.log(`==== parse    lossless (info): ${parsePass}/${results.length} ====\n`)

	for (const r of results) {
		const rt = r.roundTripLossless ? '✓' : '✗'
		const ps = r.parseLossless ? '✓' : '△'
		console.log(`  roundTrip:${rt}  parse:${ps}  ${r.id}  ${r.title}`)
		if (!r.parseLossless && r.parsePreview) {
			console.log('    original :', r.parsePreview.original.slice(0, 180))
			console.log('    rendered :', r.parsePreview.rendered.slice(0, 180))
		}
	}

	const acFail = results.length - roundTripPass
	if (acFail > 0) {
		console.log(`\n✗ AC 未達成: ${acFail} 件が round-trip で不一致`)
		process.exitCode = 1
	} else {
		console.log('\n✓ AC 達成: 全件 round-trip lossless (TipTap JSON レベルで idempotent)')
	}
}

/** HTML を syntactic 差分吸収のため正規化: タグ間空白除去、連続空白圧縮、self-closing 統一、style 末尾 `;` 除去。 */
function normalize(html: string): string {
	return html
		.replaceAll(/>\s+</g, '><')
		.replaceAll(/\s+/g, ' ')
		.replaceAll(/<(br|hr|img)([^>]*)\s*\/?>/gi, '<$1$2>')
		.replaceAll(/style="([^"]*?);?\s*"/g, 'style="$1"')
		.replaceAll('&nbsp;', ' ')
		.trim()
}

main().catch(error => {
	console.error(error)
	process.exit(1)
})
