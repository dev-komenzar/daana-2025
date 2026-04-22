import { resolve } from 'node:path'
import PocketBase from 'pocketbase'

import { loadDotenv, readMigrateEnv } from './lib/env'
import { parseArgs } from './lib/parse-args'

const HELP_TEXT = `Usage: pnpm migrate [options]

microCMS (news / projects / assets) → PocketBase 移行スクリプト

Options:
  -h, --help                Show this help
      --dry-run             Do not write to PocketBase, only print summary (daana-ov9.11)
      --only=<kind>         Target only 'news' | 'projects' | 'media'
      --report-file=<path>  Write JSON report to the given path (daana-ov9.10)

Environment (load from .env in current working directory):
  MICROCMS_API_KEY    microCMS API key (samgha project)
  PB_URL              PocketBase base URL (default http://localhost:8090)
  PB_ADMIN_EMAIL      PocketBase superuser email
  PB_ADMIN_PASSWORD   PocketBase superuser password
`

export async function authenticateSuperuser(pb: PocketBase, email: string, password: string): Promise<void> {
	await pb.collection('_superusers').authWithPassword(email, password)
}

async function run(): Promise<void> {
	loadDotenv(resolve(process.cwd(), '.env'))
	const args = parseArgs(process.argv.slice(2))
	if (args.help) {
		process.stdout.write(HELP_TEXT)
		return
	}

	const env = readMigrateEnv()
	console.log(`[migrate] PB_URL=${env.pbUrl}`)
	console.log(`[migrate] authenticating superuser ${env.pbAdminEmail}`)

	const pb = new PocketBase(env.pbUrl)
	await authenticateSuperuser(pb, env.pbAdminEmail, env.pbAdminPassword)

	console.log(`[migrate] superuser auth ok (token valid=${pb.authStore.isValid})`)
	console.log(`[migrate] dry-run=${args.dryRun} only=${args.only ?? 'all'}`)
	console.log('[migrate] TODO: news/projects/media migration (daana-ov9.2〜9)')
}

run().catch((error: unknown) => {
	const message = error instanceof Error ? error.message : String(error)
	console.error(`[migrate] error: ${message}`)
	process.exit(1)
})
