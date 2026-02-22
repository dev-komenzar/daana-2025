// Domain層（クライアント/サーバー両方で使用可能）
export { type INewsRepository, type NewsItem, type NewsItemKey, NewsItemSchema, type ReturnNewApi, ReturnNewApiSchema } from './domain'

// 使用方法:
// - Remote Functions: import { ... } from '$lib/news/remote'
// - Application層（サーバーのみ）: import { ... } from '$lib/news/app'
