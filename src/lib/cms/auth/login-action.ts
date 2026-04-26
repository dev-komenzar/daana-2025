import type PocketBase from 'pocketbase'

export type LoginResult = { message: string; ok: false; status: number } | { ok: true }

export async function loginAction(pb: PocketBase, email: string, password: string): Promise<LoginResult> {
	if (!email || !password) {
		return { message: 'email と password を入力してください', ok: false, status: 400 }
	}
	try {
		const auth = await pb.collection('users').authWithPassword(email, password)
		if (auth.record?.role !== 'editor') {
			pb.authStore.clear()
			return { message: 'editor 権限がありません', ok: false, status: 403 }
		}
	} catch {
		return { message: '認証に失敗しました', ok: false, status: 400 }
	}
	return { ok: true }
}
