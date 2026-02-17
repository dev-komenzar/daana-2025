<script lang="ts">
import type { Pathname } from '$app/types'

import { resolve } from '$app/paths'

type Properties = {
	class?: string
	href: Pathname | (string & {})
	textContent: string
}

let { class: className, href, textContent }: Properties = $props()

const isExternal = typeof href === 'string' && (href.startsWith('http://') || href.startsWith('https://'))
</script>

<a href={resolve(href as Pathname)} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined} class={className}>
	<div class="outer">
		<div class="inner">
			<span class="text">{textContent}</span>
		</div>
		<div class="inner-right">
			<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M0.710938 1H13.7544V14.1837" stroke="currentColor" stroke-width="2" />
				<path d="M0.710938 14.1837L13.7544 1" stroke="currentColor" stroke-width="2" />
			</svg>
		</div>
	</div>
</a>

<style>
.outer {
	position: relative;
	box-sizing: border-box;
	width: 247px;
	height: 52px;
	color: #ff8957;
	background: #fff;
	border: 2.5px solid #ff8957;
	border-radius: 11px;
	transition:
		background 0.3s,
		color 0.3s,
		transform 0.3s;
}

.inner {
	position: absolute;
	width: 170px;
	height: 47px;
	border-color: #ff8957;
	border-style: none dashed none none;
	border-width: 2.5px;
	transition: border-color 0.3s;
}

.text {
	position: absolute;
	top: 50%;
	left: 50%;
	font-family: var(--font-heading-bold);
	font-size: 16px;
	line-height: 23px;
	letter-spacing: 0.02em;

	/* VIEW MORE */
	white-space: nowrap;
	transform: translate(-50%, -50%);
}

.inner-right {
	position: absolute;
	top: 0;
	right: 0;
	width: 77px;
	height: 47px;
	border: none;
}

.inner-right > svg {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.outer:hover {
	color: #fff;
	background: #ff8957;
}

.outer:hover .inner {
	border-color: #fff;
}

.outer:active {
	transform: scale(0.96);
	transition:
		background 0.3s,
		color 0.3s,
		transform 0.3s;
}
</style>
