import { describe, expect, test } from 'vitest'

import { readMigrateEnv } from './env'

describe('readMigrateEnv (daana-ov9.1)', () => {
	test('必須 env が揃っていれば値を返す', () => {
		const env = readMigrateEnv({
			MICROCMS_API_KEY: 'k',
			PB_ADMIN_EMAIL: 'admin@example.com',
			PB_ADMIN_PASSWORD: 'pw',
			PB_URL: 'http://pb.local',
		})
		expect(env).toEqual({
			microcmsApiKey: 'k',
			pbAdminEmail: 'admin@example.com',
			pbAdminPassword: 'pw',
			pbUrl: 'http://pb.local',
		})
	})

	test('PB_URL 未指定ならデフォルト http://localhost:8090', () => {
		const env = readMigrateEnv({
			MICROCMS_API_KEY: 'k',
			PB_ADMIN_EMAIL: 'a@b.c',
			PB_ADMIN_PASSWORD: 'pw',
		})
		expect(env.pbUrl).toBe('http://localhost:8090')
	})

	test('必須 env 欠落で例外、欠落キー名を含む', () => {
		expect(() =>
			readMigrateEnv({
				MICROCMS_API_KEY: 'k',
			}),
		).toThrow(/PB_ADMIN_EMAIL/)
	})
})
