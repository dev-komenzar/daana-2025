import type { HandleClientError } from '@sveltejs/kit'

import consola from 'consola'

/**
 * Handle unhandled client-side errors.
 */
export const handleError: HandleClientError = ({ error, message, status }) => {
	consola.error('[client] Unhandled error:', { error, message, status })

	return {
		message: 'An error occurred',
	}
}

// Catch fontplus.js runtime errors (not load failures)
if (globalThis.window !== undefined) {
	globalThis.addEventListener(
		'error',
		event => {
			// Check if error originated from fontplus.js
			if (event.filename?.includes('fontplus.js') || event.filename?.includes('fontplus.jp')) {
				consola.warn('[fontplus] Runtime error caught:', event.message)
				event.preventDefault() // Prevent from crashing the app
				return false
			}
		},
		true,
	) // Use capture phase
}
