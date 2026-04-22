export type MigrateArgs = {
	dryRun: boolean
	help: boolean
	only?: 'media' | 'news' | 'projects'
	reportFile?: string
}

export function parseArgs(argv: readonly string[]): MigrateArgs {
	const args: MigrateArgs = { dryRun: false, help: false }
	for (const raw of argv) {
		if (raw === '--help' || raw === '-h') {
			args.help = true
			continue
		}
		if (raw === '--dry-run') {
			args.dryRun = true
			continue
		}
		if (raw.startsWith('--only=')) {
			const value = raw.slice('--only='.length)
			if (value !== 'news' && value !== 'projects' && value !== 'media') {
				throw new Error(`--only must be one of: news | projects | media (got ${value})`)
			}
			args.only = value
			continue
		}
		if (raw.startsWith('--report-file=')) {
			args.reportFile = raw.slice('--report-file='.length)
			continue
		}
	}
	return args
}
