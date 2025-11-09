/* eslint-disable @typescript-eslint/no-explicit-any */

import * as v from 'valibot';
import { afterAll, describe, expect, test, vi } from 'vitest';

import type { NewsItem, ReturnNewApi } from './cms';

import { api } from './client';
import { getNewsAsync, NewsItemSchema } from './cms';

// =================================================================
// 1. Unit Tests (using mock)
// =================================================================

describe('getNewsAsync (Unit)', () => {
	// api.get をモックする
	const spy = vi.spyOn(api, 'get');

	afterAll(() => {
		spy.mockRestore();
	});

	test('引数に基づいて正しいURLが生成され、APIが呼び出されること', async () => {
		// モックのレスポンスを設定
		const mockResponse: ReturnNewApi = {
			contents: [],
			limit: 10,
			offset: 5,
			totalCount: 0
		};
		spy.mockReturnValue({
			json: () => Promise.resolve(mockResponse)
		} as any);

		const offset = 5;
		const limit = 10;
		const fields: (keyof NewsItem)[] = ['id', 'title'];

		await getNewsAsync(offset, limit, fields);

		// api.get が期待した URL で呼び出されたか検証
		const expectedUrl = 'news?offset=5&limit=10&fields=id,title';
		expect(spy).toHaveBeenCalledWith(expectedUrl, undefined);
	});

	test('APIから取得したニュース記事の contents 配列を返すこと', async () => {
		// モックするレスポンスデータを作成
		const mockResponse: ReturnNewApi = {
			contents: [
				v.parse(NewsItemSchema, {
					content: '<p>本文1</p>',
					createdAt: "2023-06-31T00:00:00.000Z",
					id: 'news-1',
					publishedAt: "2023-06-31T00:00:00.000Z",
					revisedAt: "2023-06-31T00:00:00.000Z",
					thumbnail: { height: 100, url: 'https://example.com/thumb1.png', width: 100 },
					title: 'テストニュース1',
					updatedAt: "2023-06-31T00:00:00.000Z"
				})
			],
			limit: 10,
			offset: 0,
			totalCount: 1
		};

		// api.get のモックを上書き
		spy.mockReturnValue({
			json: (): Promise<ReturnNewApi> => Promise.resolve(mockResponse)
		} as any);

		const news = await getNewsAsync(0, 10, ['id', 'title']);

		// 返り値がモックデータの contents と一致するか検証
		expect(news).toEqual(mockResponse.contents);
	});

	test('API通信が失敗した場合、エラーをスローすること', async () => {
		// api.get がエラーをスローするようにモック
		const mockError = new Error('API Error');
		spy.mockReturnValue({
			json: () => Promise.reject(mockError)
		} as any);

		// getNewsAsync を呼び出すとエラーがスローされることを検証
		await expect(getNewsAsync(0, 10, ['id'])).rejects.toThrow(mockError);
	});
});

// =================================================================
// 2. Integration Tests (calling actual API)
// =================================================================

const hasApiKey = process.env.MICROCMS_API_KEY !== undefined;
const isIntegrationTest = process.env.TEST_INTEGRATION === 'true';

describe.skipIf(!isIntegrationTest || !hasApiKey)(
	'getNewsAsync (Integration)',
	() => {
		test('実際のAPIからNewsItemの配列を取得し、スキーマが一致すること', async () => {
			// タイムアウトを長めに設定 (例: 10秒)
			vi.setConfig({ testTimeout: 10_000 });

			let result: NewsItem[] | undefined;
			let error: Error | undefined;

			try {
				// 実際にAPIを叩く
				result = await getNewsAsync(0, 3, ['id', 'title', 'publishedAt']);
			} catch (error_) {
				error = error_ as Error;
			}

			// エラーが発生していないことを確認
			expect(error).toBeUndefined();

			// 結果が配列であることを確認
			expect(Array.isArray(result)).toBe(true);

			// 配列の各要素がNewsItemスキーマを満たしていることを確認
			const schema = v.array(
				v.object({
					id: v.string(),
					publishedAt: v.pipe(v.string(), v.isoTimestamp()),
					title: (v.string()),
				})
			);
			expect(v.safeParse(schema, result).success).toBe(true);
		});
	}
);