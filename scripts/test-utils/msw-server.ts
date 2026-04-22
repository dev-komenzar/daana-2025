import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll } from 'vitest'

import { microCmsHandlers } from './msw-handlers'

export const server = setupServer(...microCmsHandlers)

export function setupMswServer() {
	beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
	afterEach(() => server.resetHandlers())
	afterAll(() => server.close())
}
