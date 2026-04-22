import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import PocketBase from 'pocketbase'

import type { MediaRepository, UploadedMedia } from './lib/media-upload'
import type { NewsRepository } from './lib/news-sync'
import type { ProjectRepository } from './lib/project-sync'

import { loadDotenv, readMigrateEnv } from './lib/env'
import { createMicrocmsClient } from './lib/microcms'
import { defaultImageFetcher, type MigrationReport, type MigrationTarget, runMigration } from './lib/migrate-runner'
import { parseArgs } from './lib/parse-args'
import { createPbMediaRepo, ensureMediaOriginalUrlField } from './lib/pb-media-repo'
import { createPbNewsRepo } from './lib/pb-news-repo'
import { createPbProjectRepo } from './lib/pb-project-repo'

const HELP_TEXT = `Usage: pnpm migrate [options]

microCMS (news / projects / assets) → PocketBase 移行スクリプト

Options:
  -h, --help                Show this help
      --dry-run             Do not write to PocketBase, only print summary
      --only=<kind>         Target only 'news' | 'projects' | 'media'
      --report-file=<path>  Write JSON report to the given path

Environment (load from .env in current working directory):
  MICROCMS_API_KEY    microCMS API key (samgha project)
  PB_URL              PocketBase base URL (default http://localhost:8090)
  PB_ADMIN_EMAIL      PocketBase superuser email
  PB_ADMIN_PASSWORD   PocketBase superuser password
`

// PocketBase サーバは v0.22 系 (Dockerfile で固定)。SDK 0.26 の pb.admins で互換取る。
export async function authenticateSuperuser(pb: PocketBase, email: string, password: string): Promise<void> {
	await pb.admins.authWithPassword(email, password)
}

function createDryRunMediaRepo(): MediaRepository {
	const seen = new Map<string, UploadedMedia>()
	return {
		async create(input) {
			const rec: UploadedMedia = {
				fileUrl: `dry-run://media/${input.fileName}`,
				id: `dry-media-${seen.size + 1}`,
				mime: input.mime,
				originalUrl: input.originalUrl,
			}
			seen.set(input.originalUrl, rec)
			return rec
		},
		async findByOriginalUrl(url) {
			return seen.get(url)
		},
	}
}

function createDryRunNewsRepo(): NewsRepository {
	const store = new Map<string, { id: string; originalId: string }>()
	return {
		async create(input) {
			const id = `dry-news-${store.size + 1}`
			store.set(input.originalId, { id, originalId: input.originalId })
			return { id }
		},
		async findByOriginalId(id) {
			return store.get(id)
		},
		async update(id) {
			return { id }
		},
	}
}

function createDryRunProjectRepo(): ProjectRepository {
	const store = new Map<string, { id: string; originalId: string }>()
	return {
		async create(input) {
			const id = `dry-project-${store.size + 1}`
			store.set(input.originalId, { id, originalId: input.originalId })
			return { id }
		},
		async findByOriginalId(id) {
			return store.get(id)
		},
		async update(id) {
			return { id }
		},
	}
}

function printReport(report: MigrationReport): void {
	console.log('\n=== Migration Report ===')
	console.log(`target: ${report.target}, dry-run: ${report.dryRun}`)
	console.log(`started: ${report.startedAt}`)
	console.log(`finished: ${report.finishedAt}`)
	console.log(`news    : created=${report.news.created} updated=${report.news.updated} errors=${report.news.errors.length}`)
	console.log(`projects: created=${report.projects.created} updated=${report.projects.updated} errors=${report.projects.errors.length}`)
	console.log(`media   : created=${report.media.created} reused=${report.media.reused} errors=${report.media.errors.length}`)
	if (report.news.errors.length > 0) {
		console.log('news errors:')
		for (const e of report.news.errors) console.log(`  - ${e.originalId}: ${e.message}`)
	}
	if (report.projects.errors.length > 0) {
		console.log('project errors:')
		for (const e of report.projects.errors) console.log(`  - ${e.originalId}: ${e.message}`)
	}
	if (report.media.errors.length > 0) {
		console.log('media errors:')
		for (const e of report.media.errors) console.log(`  - ${e.source}: ${e.message}`)
	}
}

async function run(): Promise<void> {
	loadDotenv(resolve(process.cwd(), '.env'))
	const args = parseArgs(process.argv.slice(2))
	if (args.help) {
		process.stdout.write(HELP_TEXT)
		return
	}

	const env = readMigrateEnv()
	const target: MigrationTarget = args.only ?? 'all'
	console.log(`[migrate] PB_URL=${env.pbUrl} target=${target} dry-run=${args.dryRun}`)

	const microcms = createMicrocmsClient({ apiKey: env.microcmsApiKey })

	let mediaRepo: MediaRepository
	let newsRepo: NewsRepository
	let projectRepo: ProjectRepository

	if (args.dryRun) {
		console.log('[migrate] dry-run: using in-memory repos (no PocketBase writes)')
		mediaRepo = createDryRunMediaRepo()
		newsRepo = createDryRunNewsRepo()
		projectRepo = createDryRunProjectRepo()
	} else {
		console.log(`[migrate] authenticating superuser ${env.pbAdminEmail}`)
		const pb = new PocketBase(env.pbUrl)
		await authenticateSuperuser(pb, env.pbAdminEmail, env.pbAdminPassword)
		console.log(`[migrate] superuser auth ok (token valid=${pb.authStore.isValid})`)
		await ensureMediaOriginalUrlField(pb)
		mediaRepo = createPbMediaRepo(pb)
		newsRepo = createPbNewsRepo(pb)
		projectRepo = createPbProjectRepo(pb)
	}

	const report = await runMigration({
		dryRun: args.dryRun,
		fetchImage: defaultImageFetcher,
		logger: message => console.log(message),
		mediaRepo,
		microcms,
		newsRepo,
		projectRepo,
		target,
	})

	printReport(report)

	if (args.reportFile) {
		await writeFile(args.reportFile, JSON.stringify(report, undefined, 2))
		console.log(`[migrate] report written: ${args.reportFile}`)
	}

	const errorCount = report.news.errors.length + report.projects.errors.length + report.media.errors.length
	if (errorCount > 0) {
		console.error(`[migrate] finished with ${errorCount} error(s)`)
		process.exit(2)
	}
}

run().catch((error: unknown) => {
	const message = error instanceof Error ? error.message : String(error)
	console.error(`[migrate] error: ${message}`)
	process.exit(1)
})
