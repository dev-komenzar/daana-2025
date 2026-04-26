import { expect, test } from '@playwright/test'

test('ホームページが読み込める', async ({ page }) => {
	await page.goto('/')
	await expect(page).toHaveTitle(/日本仏教徒協会|ほうどう寺/)
})
