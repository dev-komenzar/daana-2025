import type PocketBase from 'pocketbase'

import { describe, expect, test, vi } from 'vitest'

import { loginAction } from './login-action'

type MockPb = {
	authStore: { clear: ReturnType<typeof vi.fn> }
	collection: ReturnType<typeof vi.fn>
}

function mockPb(authResult: { error: Error; ok: false } | { ok: true; role: string }): MockPb {
	const authWithPassword = vi.fn(async () => {
		if (authResult.ok) return { record: { role: authResult.role } }
		throw authResult.error
	})
	return {
		authStore: { clear: vi.fn() },
		collection: vi.fn(() => ({ authWithPassword })),
	}
}

describe('loginAction', () => {
	test('editor ロールで認証成功すると ok:true', async () => {
		const pb = mockPb({ ok: true, role: 'editor' })
		const result = await loginAction(pb as unknown as PocketBase, 'a@example.com', 'pw')
		expect(result).toEqual({ ok: true })
		expect(pb.collection).toHaveBeenCalledWith('users')
	})

	test('editor 以外のロールなら 403 でクリアされる', async () => {
		const pb = mockPb({ ok: true, role: 'viewer' })
		const result = await loginAction(pb as unknown as PocketBase, 'v@example.com', 'pw')
		expect(result).toMatchObject({ ok: false, status: 403 })
		expect(pb.authStore.clear).toHaveBeenCalledOnce()
	})

	test('認証自体が失敗すれば 400', async () => {
		const pb = mockPb({ error: new Error('bad creds'), ok: false })
		const result = await loginAction(pb as unknown as PocketBase, 'x@example.com', 'wrong')
		expect(result).toMatchObject({ ok: false, status: 400 })
	})

	test('email / password 未入力なら 400', async () => {
		const pb = mockPb({ ok: true, role: 'editor' })
		const result = await loginAction(pb as unknown as PocketBase, '', '')
		expect(result).toMatchObject({ ok: false, status: 400 })
		expect(pb.collection).not.toHaveBeenCalled()
	})
})
