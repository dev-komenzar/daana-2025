// Domain層（クライアント/サーバー両方で使用可能）
export { type IProjectRepository, type ProjectItem, type ProjectItemKey, ProjectItemSchema, type ProjectType, ProjectTypeSchema, type ReturnProjectApi, ReturnProjectApiSchema } from './domain'

// 使用方法:
// - Remote Functions: import { ... } from '$lib/projects/projects.remote'
// - Application層（サーバーのみ）: import { ... } from '$lib/projects/app'
