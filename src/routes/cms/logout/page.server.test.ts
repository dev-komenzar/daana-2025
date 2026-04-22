import { describe, expect, test, vi } from 'vitest'

import { actions } from './+page.server'

type MockLocals = {
	pb: { authStore: { clear: ReturnType<typeof vi.fn> } }
}

function createEvent(): { locals: MockLocals } {
	return {
		locals: {
			pb: { authStore: { clear: vi.fn() } },
		},
	}
}

describe('logout default action', () => {
	test('calls pb.authStore.clear()', async () => {
		const event = createEvent()
		await expect(actions.default(event as unknown as Parameters<typeof actions.default>[0])).rejects.toMatchObject({ location: '/cms/login', status: 303 })
		expect(event.locals.pb.authStore.clear).toHaveBeenCalledOnce()
	})

	test('throws redirect 303 to /cms/login', async () => {
		const event = createEvent()
		await expect(actions.default(event as unknown as Parameters<typeof actions.default>[0])).rejects.toMatchObject({ location: '/cms/login', status: 303 })
	})
})
