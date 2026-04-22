import { describe, expect, test } from 'vitest'

import { parseArgs } from './parse-args'

describe('parseArgs (daana-ov9.1)', () => {
	test('デフォルトは help=false, dry-run=false', () => {
		expect(parseArgs([])).toEqual({ dryRun: false, help: false })
	})

	test('--help / -h で help=true', () => {
		expect(parseArgs(['--help']).help).toBe(true)
		expect(parseArgs(['-h']).help).toBe(true)
	})

	test('--dry-run で dryRun=true', () => {
		expect(parseArgs(['--dry-run']).dryRun).toBe(true)
	})

	test('--only=news / projects / media を解釈する', () => {
		expect(parseArgs(['--only=news']).only).toBe('news')
		expect(parseArgs(['--only=projects']).only).toBe('projects')
		expect(parseArgs(['--only=media']).only).toBe('media')
	})

	test('--only に不正な値を渡すと例外', () => {
		expect(() => parseArgs(['--only=blog'])).toThrow(/--only/i)
	})

	test('--report-file=path を解釈する', () => {
		expect(parseArgs(['--report-file=./out/report.json']).reportFile).toBe('./out/report.json')
	})

	test('複数オプションの組み合わせ', () => {
		const args = parseArgs(['--dry-run', '--only=news', '--report-file=r.json'])
		expect(args).toEqual({
			dryRun: true,
			help: false,
			only: 'news',
			reportFile: 'r.json',
		})
	})
})
