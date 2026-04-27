import { json } from '@sveltejs/kit'

import type { RequestHandler } from './$types'

const PB_HEALTH_TIMEOUT_MS = 2000

type PbStatus = 'ok' | 'unconfigured' | 'unreachable'

async function checkPb(): Promise<PbStatus> {
	const pbUrl = process.env.PB_URL?.trim()
	if (!pbUrl) return 'unconfigured'

	const controller = new AbortController()
	const timer = setTimeout(() => controller.abort(), PB_HEALTH_TIMEOUT_MS)

	try {
		const response = await fetch(`${pbUrl.replace(/\/$/, '')}/api/health`, {
			signal: controller.signal,
		})
		return response.ok ? 'ok' : 'unreachable'
	} catch {
		return 'unreachable'
	} finally {
		clearTimeout(timer)
	}
}

export const GET: RequestHandler = async () => {
	const pb = await checkPb()

	return json({
		pb,
		status: 'ok',
		timestamp: new Date().toISOString(),
	})
}
