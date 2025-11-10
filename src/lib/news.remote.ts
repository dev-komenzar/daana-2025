import type { NewsItemKey } from '$lib/cms';

import { query } from '$app/server';
import { getNewsAsync, getNewsTotalCount, NewsItemSchema } from '$lib/cms';
import * as v from 'valibot';

export const getNewsRemote = query(
	v.object({
		fields: v.array(v.keyof(NewsItemSchema)),
		limit: v.number(),
		offset: v.number(),
	}),
	async (
		{fields, limit, offset}:
		{fields: NewsItemKey[]; limit: number, offset: number,}
	) => {
		const contents = await getNewsAsync(offset, limit, fields);
		return contents;
	}
)

export const getNewsTotalCountRemote = query(
	async () => {
		const totalCount = await getNewsTotalCount();
		return totalCount;
	}
)