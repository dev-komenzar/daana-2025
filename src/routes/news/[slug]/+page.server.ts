import { getNewsPost } from '$lib/cms';
import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	return {
		newsPost: getNewsPost(slug).catch((error_) => {
			console.error(`Failed to load news post with id: ${slug}`, error_);
			throw error(404, 'ニュースが見つかりませんでした');
		}),
	};
};
