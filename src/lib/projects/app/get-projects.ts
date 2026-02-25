import type { ProjectItem, ProjectItemKey } from '../domain/schema'

import { projectRepository } from '../infra/repository'

/**
 * プロジェクト一覧を取得
 * @param fields 取得フィールド
 */
export async function getProjectsAsync(fields: ProjectItemKey[]): Promise<ProjectItem[]> {
	return projectRepository.getProjects(fields)
}
