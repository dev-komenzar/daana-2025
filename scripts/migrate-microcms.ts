import { resolve } from 'node:path'
import PocketBase from 'pocketbase'

import { loadDotenv, readMigrateEnv } from './lib/env'
import { createMicrocmsClient, fetchAllNews, fetchAllProjects } from './lib/microcms'
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

// PocketBase サーバは v0.22 系 (Dockerfile で固定)。SDK は 0.23+ で `_superusers`
// コレクションに移行したが、v0.22 互換の `pb.admins.authWithPassword` が SDK にまだ残っており、
// そちらを利用する。
export async function authenticateSuperuser(pb: PocketBase, email: string, password: string): Promise<void> {
	await pb.admins.authWithPassword(email, password)
}

async function run(): Promise<void> {
	loadDotenv(resolve(process.cwd(), '.env'))
	const args = parseArgs(process.argv.slice(2))
	if (args.help) {
		process.stdout.write(HELP_TEXT)
		return
	}

	const env = readMigrateEnv()
	const target = args.only ?? 'all'
	console.log(`[migrate] PB_URL=${env.pbUrl} target=${target} dry-run=${args.dryRun}`)

	const microcms = createMicrocmsClient({ apiKey: env.microcmsApiKey })

	if (args.dryRun) {
		if (target === 'all' || target === 'news') {
			const news = await fetchAllNews(microcms)
			console.log(`[migrate] news: fetched ${news.length} items (dry-run)`)
		}
		if (target === 'all' || target === 'projects') {
			const projects = await fetchAllProjects(microcms)
			console.log(`[migrate] projects: fetched ${projects.length} items (dry-run)`)
		}
		if (target === 'media') {
			console.log('[migrate] media: dry-run は news/projects 経由での画像参照のみ集計 (daana-ov9.11 で拡張予定)')
		}
		console.log('[migrate] dry-run complete')
		return
	}

	console.log(`[migrate] authenticating superuser ${env.pbAdminEmail}`)
	const pb = new PocketBase(env.pbUrl)
	await authenticateSuperuser(pb, env.pbAdminEmail, env.pbAdminPassword)
	console.log(`[migrate] superuser auth ok (token valid=${pb.authStore.isValid})`)
	console.log('[migrate] TODO: news/projects/media upsert (daana-ov9.5〜9)')
}

run().catch((error: unknown) => {
	const message = error instanceof Error ? error.message : String(error)
	console.error(`[migrate] error: ${message}`)
	process.exit(1)
})
