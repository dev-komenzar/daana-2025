import { prerender } from '$app/server'

import type { ProjectItemKey } from './domain/schema'

import { projectRepository } from './infra/repository'

// prerender版: プロジェクト一覧用
export const getProjectsPrerender = prerender(async () => {
	const fields: ProjectItemKey[] = ['id', 'title', 'projectLink', 'type']
	return await projectRepository.getProjects(fields)
})
