import { includeIgnoreFile } from '@eslint/compat'
import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import perfectionist from 'eslint-plugin-perfectionist'
import svelte from 'eslint-plugin-svelte'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import { fileURLToPath } from 'node:url'
import ts from 'typescript-eslint'

import svelteConfig from './svelte.config.js'

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url))

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	{
		ignores: ['pocketbase/pb_migrations/**', 'pocketbase/pb_hooks/**'],
	},
	js.configs.recommended,
	...ts.configs.recommended,
	perfectionist.configs['recommended-natural'],
	eslintPluginUnicorn.configs['recommended'],
	...svelte.configs.recommended,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
		rules: {
			// アンダースコア始まりは「意図的な未使用」として許容する (TDD の stub 等)
			'@typescript-eslint/no-unused-vars': ['error', { args: 'after-used', argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
			// typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			'no-undef': 'off',
		},
	},
	{
		// scripts/ は Node CLI エントリ。process.exit や CLI 慣用略語 (Args) を許容する。
		files: ['scripts/**/*.ts'],
		rules: {
			'unicorn/import-style': 'off',
			'unicorn/no-process-exit': 'off',
			'unicorn/prefer-top-level-await': 'off',
			'unicorn/prevent-abbreviations': 'off',
		},
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				projectService: true,
				svelteConfig,
			},
		},
		rules: {
			'svelte/no-navigation-without-resolve': 'warn',
		},
	},
	prettierConfig,
)
