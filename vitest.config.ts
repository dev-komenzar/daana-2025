import { sveltekit } from '@sveltejs/kit/vite'
import { svelteTesting } from '@testing-library/svelte/vite'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => ({
	plugins: [sveltekit()],
	test: {
		env: loadEnv(mode, process.cwd(), ''),
		exclude: ['**/node_modules/**', '**/.direnv/**', '**/.svelte-kit/**', '**/dist/**', 'e2e/**'],
		globals: true,
		projects: [
			{
				extends: true,
				test: {
					environment: 'node',
					exclude: ['src/**/*.svelte.test.{ts,js}'],
					include: ['src/**/*.test.{ts,js}'],
					name: 'server',
				},
			},
			{
				extends: true,
				plugins: [svelteTesting()],
				test: {
					environment: 'jsdom',
					include: ['src/**/*.svelte.test.{ts,js}'],
					name: 'client',
					setupFiles: ['./vitest-setup-client.ts'],
				},
			},
		],
	},
}))
