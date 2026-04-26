<script lang="ts">
import { MetaTags } from 'svelte-meta-tags'

import type { ActionData } from './$types'

let { form }: { form: ActionData } = $props()
</script>

<MetaTags
	title="CMS ログイン"
	robots="noindex, nofollow"
/>

<main class="login">
	<h1>CMS ログイン</h1>

	{#if form?.message}
		<p
			class="error"
			role="alert"
		>
			{form.message}
		</p>
	{/if}

	<form method="POST">
		<label>
			メールアドレス
			<input
				type="email"
				name="email"
				autocomplete="username"
				required
				value={form?.email ?? ''}
			/>
		</label>
		<label>
			パスワード
			<input
				type="password"
				name="password"
				autocomplete="current-password"
				required
			/>
		</label>
		<button type="submit">ログイン</button>
	</form>
</main>

<style>
.login {
	max-width: 360px;
	padding: 0 16px;
	margin: 48px auto;
}

.login h1 {
	margin-bottom: 16px;
	font-size: 20px;
}

.login form {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.login label {
	display: flex;
	flex-direction: column;
	gap: 4px;
	font-size: 14px;
}

.login input {
	padding: 8px 10px;
	font-size: 16px;
	border: 1px solid #ccc;
	border-radius: 4px;
}

.login button {
	padding: 10px;
	font-size: 16px;
	color: #fff;
	cursor: pointer;
	background: var(--color-primary, #222);
	border: none;
	border-radius: 4px;
}

.error {
	padding: 8px 10px;
	margin-bottom: 12px;
	color: #7a0000;
	background: #fdd;
	border-radius: 4px;
}
</style>
