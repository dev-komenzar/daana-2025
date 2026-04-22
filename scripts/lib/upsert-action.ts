/**
 * original_id をキーとして upsert の action を解決する純粋関数。
 *
 * Green 実装は daana-ov9.7 / daana-ov9.8 で行う。それまでは Red を維持する。
 */

export interface PbRecordLike {
	id: string
	originalId: string
}

export type UpsertAction = { id: string; type: 'update' } | { type: 'create' }

export function resolveUpsertAction(_originalId: string, _existing?: PbRecordLike): UpsertAction {
	throw new Error('Not implemented: daana-ov9.7 / daana-ov9.8')
}
