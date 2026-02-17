<script lang="ts">
import type { Pathname } from '$app/types'

import { goto } from '$app/navigation'
import { resolve } from '$app/paths'
import { onDestroy, onMount } from 'svelte'

interface Properties {
	countdownSeconds?: number
	redirectTo?: Pathname
}

let { countdownSeconds = 5, redirectTo = '/' }: Properties = $props()
let count = $state(countdownSeconds)
let intervalId: ReturnType<typeof setInterval> | undefined

function redirectNow() {
	if (intervalId) clearInterval(intervalId)
	goto(resolve(redirectTo))
}

onMount(() => {
	intervalId = setInterval(() => {
		count--
		if (count <= 0) {
			redirectNow()
		}
	}, 1000)
})

onDestroy(() => {
	if (intervalId) clearInterval(intervalId)
})
</script>

<div class="container">
	<div class="content">
		<p class="message">
			ホームページを更新したので、お探しのページはございません。<br />
			新ページのトップに<span
				class="count"
				aria-live="polite">{count}</span
			>秒で移動します。
		</p>
		<button
			type="button"
			class="redirect-button"
			onclick={redirectNow}
		>
			<span class="button-text">今すぐ移動</span>
			<svg
				width="15"
				height="15"
				viewBox="0 0 15 15"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
			>
				<path
					d="M0.710938 1H13.7544V14.1837"
					stroke="currentColor"
					stroke-width="2"
				/>
				<path
					d="M0.710938 14.1837L13.7544 1"
					stroke="currentColor"
					stroke-width="2"
				/>
			</svg>
		</button>
	</div>
</div>

<style>
.container {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 50vh;
	padding: 2rem;
}

.content {
	display: flex;
	flex-direction: column;
	gap: 2rem;
	align-items: center;
	text-align: center;
}

.message {
	font-family: var(--font-body);
	font-size: 14px;
	line-height: 2;
	color: var(--color-text);
	letter-spacing: 0.04em;
}

.count {
	display: inline-block;
	min-width: 1.5em;
	font-family: var(--font-heading-bold);
	font-size: 18px;
	color: var(--color-accent);
}

.redirect-button {
	box-sizing: border-box;
	display: flex;
	gap: 1rem;
	align-items: center;
	justify-content: center;
	width: 200px;
	height: 52px;
	padding: 0 1.5rem;
	color: var(--color-accent);
	cursor: pointer;
	background: #fff;
	border: 2.5px solid var(--color-accent);
	border-radius: 11px;
	transition:
		background 0.3s,
		color 0.3s,
		transform 0.3s;
}

.button-text {
	font-family: var(--font-heading-bold);
	font-size: 16px;
	letter-spacing: 0.02em;
}

.redirect-button:hover {
	color: #fff;
	background: var(--color-accent);
}

.redirect-button:active {
	transform: scale(0.96);
}

@media screen and (width >= 768px) {
	.message {
		font-size: 16px;
	}
}
</style>
