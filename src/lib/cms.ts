import type { Options } from 'ky';

import consola from 'consola';
import * as v from 'valibot';

import { api } from './client';

export const NewsItemSchema = v.object({
	content: v.optional(v.string()),
	createdAt: v.optional(v.pipe(v.string(), v.isoTimestamp())),
	id: v.string(),
	publishedAt: v.optional(v.pipe(v.string(), v.isoTimestamp())),
	revisedAt: v.optional(v.pipe(v.string(), v.isoTimestamp())),
	thumbnail: v.optional(
		v.object({
			height: v.number(),
			url: v.string(),
			width: v.number(),
	})),
	title: v.optional(v.string()),
	updatedAt: v.optional(v.pipe(v.string(), v.isoTimestamp())),
})

export type NewsItem = v.InferOutput<typeof NewsItemSchema>

export type NewsItemKey = keyof NewsItem

const ReturnNewApi = v.object({
	contents: v.array(NewsItemSchema),
	limit: v.number(),
	offset: v.number(),
	totalCount: v.number(),
})

export type ReturnNewApi = v.InferOutput<typeof ReturnNewApi>

export async function getNewsAsync(
	offset: number,
	limit: number,
	fields: NewsItemKey[],
): Promise<NewsItem[]> {
	const link = generateLink(offset, limit, fields);

	// Fetch and validate data from microCMS
	let data: ReturnNewApi;
	try {
		data = await fetchCms<ReturnNewApi>(link);
	} catch (error) {
		consola.error('Error fetching news from microCMS:', error);
		throw error;
	}

	// Log how many news loaded
	consola.info(`Loaded ${data.contents.length} news`)

	// Return only the contents array
	return data.contents;
}

export async function getNewsTotalCount(): Promise<number> {
	const link = 'news?limit=1&fields=id';

	// Fetch with minimal data to get totalCount
	let data: ReturnNewApi;
	try {
		data = await fetchCms<ReturnNewApi>(link);
	} catch (error) {
		consola.error('Error fetching news total count from microCMS:', error);
		throw error;
	}

	consola.info(`Total news count: ${data.totalCount}`)

	return data.totalCount;
}

/**
 * @param {string} link - Relative path.
 * @param {Options} options - `ky` options: https://github.com/sindresorhus/ky?tab=readme-ov-file#searchparams
 */
async function fetchCms<T>(link: string, options?: Options): Promise<T> {
	consola.start(`fetching microCMS: ${link}`);
	const json = await api.get(link, options).json<T>();
	// バリデーションを追加
	v.parse(ReturnNewApi, json);
	consola.success(`fetching success: ${link}`);
	 
	return json;
}

function generateLink(offset: number, limit: number, fields: NewsItemKey[]): string {
	const flatFields = fields.join(',');
	const link = `news?offset=${offset}&limit=${limit}&fields=${flatFields}`;
	return link
}