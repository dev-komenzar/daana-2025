import { getProjectsAsync } from '$lib/projects/app'

import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const projects = await getProjectsAsync(['id', 'title', 'projectLink', 'type'])

	return {
		projects,
	}
}
