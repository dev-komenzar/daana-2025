import type { ProjectItem, ProjectItemKey } from './schema'

export interface IProjectRepository {
	/** プロジェクト一覧を取得 */
	getProjects(fields: ProjectItemKey[]): Promise<ProjectItem[]>
}
