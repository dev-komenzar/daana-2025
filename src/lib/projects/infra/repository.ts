import consola from 'consola'
import * as v from 'valibot'

import type { IProjectRepository } from '../domain/repository'
import type { ProjectItem, ProjectItemKey, ReturnProjectApi } from '../domain/schema'

import { api, isApiConfigured } from '../../news/infra/client'
import { ReturnProjectApiSchema } from '../domain/schema'
import { pbProjectRepository } from './pb-repository'

class MicroCmsProjectRepository implements IProjectRepository {
	async getProjects(fields: ProjectItemKey[]): Promise<ProjectItem[]> {
		if (!isApiConfigured) {
			consola.warn('MICROCMS_API_KEY is not configured. Returning empty projects list.')
			return []
		}

		const flatFields = fields.join(',')
		const link = `projects?fields=${flatFields}`

		try {
			consola.start(`fetching microCMS: ${link}`)
			const json = await api.get(link).json<ReturnProjectApi>()
			v.parse(ReturnProjectApiSchema, json)
			consola.success(`fetching success: ${link}`)
			consola.info(`Loaded ${json.contents.length} projects`)
			return json.contents
		} catch (error) {
			consola.error('Error fetching projects from microCMS:', error)
			return []
		}
	}
}

export const microCmsProjectRepository: IProjectRepository = new MicroCmsProjectRepository()

function resolveCmsSource(): 'microcms' | 'pocketbase' {
	return process.env.CMS_SOURCE === 'pocketbase' ? 'pocketbase' : 'microcms'
}

export const projectRepository: IProjectRepository = resolveCmsSource() === 'pocketbase' ? pbProjectRepository : microCmsProjectRepository
