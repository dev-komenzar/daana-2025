/**
 * original_id をキーとして upsert の action を解決する純粋関数。
 * daana-u92 Red → daana-ov9.7 / daana-ov9.8 Green 実装。
 */

export interface PbRecordLike {
	id: string
	originalId: string
}

export type UpsertAction = { id: string; type: 'update' } | { type: 'create' }

export function resolveUpsertAction(originalId: string, existing?: PbRecordLike): UpsertAction {
	if (!existing) {
		return { type: 'create' }
	}
	if (existing.originalId !== originalId) {
		throw new Error(`resolveUpsertAction: originalId mismatch (requested=${originalId}, existing.originalId=${existing.originalId}, existing.id=${existing.id})`)
	}
	return { id: existing.id, type: 'update' }
}
