import { readFileSync } from 'node:fs'

export type MigrateEnv = {
	microcmsApiKey: string
	pbAdminEmail: string
	pbAdminPassword: string
	pbUrl: string
}

export function loadDotenv(path: string): void {
	let text: string
	try {
		text = readFileSync(path, 'utf8')
	} catch {
		return
	}
	for (const line of text.split('\n')) {
		const trimmed = line.trim()
		if (!trimmed || trimmed.startsWith('#')) continue
		const eq = trimmed.indexOf('=')
		if (eq === -1) continue
		const key = trimmed.slice(0, eq).trim()
		const rawValue = trimmed.slice(eq + 1).trim()
		const value = rawValue.replace(/^(['"])([\s\S]*)\1$/, '$2')
		if (!(key in process.env)) {
			process.env[key] = value
		}
	}
}

export function readMigrateEnv(source: NodeJS.ProcessEnv = process.env): MigrateEnv {
	const microcmsApiKey = source.MICROCMS_API_KEY ?? ''
	const pbUrl = source.PB_URL ?? 'http://localhost:8090'
	const pbAdminEmail = source.PB_ADMIN_EMAIL ?? ''
	const pbAdminPassword = source.PB_ADMIN_PASSWORD ?? ''

	const missing: string[] = []
	if (!microcmsApiKey) missing.push('MICROCMS_API_KEY')
	if (!pbAdminEmail) missing.push('PB_ADMIN_EMAIL')
	if (!pbAdminPassword) missing.push('PB_ADMIN_PASSWORD')
	if (missing.length > 0) {
		throw new Error(`Missing required env vars: ${missing.join(', ')}`)
	}

	return { microcmsApiKey, pbAdminEmail, pbAdminPassword, pbUrl }
}
