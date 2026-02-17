<script lang="ts">
import type { Pathname } from '$app/types'

import { resolve } from '$app/paths'

type Properties = {
	href: Pathname
	textContent: string
}

let { href, textContent }: Properties = $props()
</script>

<a href={resolve(href)}>
	<div class="outer">
		<div class="inner">
			<span class="text">{textContent}</span>
		</div>
		<div class="inner-right">
			<svg
				width="15"
				height="15"
				viewBox="0 0 15 15"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
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
		</div>
	</div>
</a>

<style>
.outer {
	position: relative;
	box-sizing: border-box;
	width: 247px;
	height: 52px;
	color: #16212f;
	background: #fff;
	border: 2.5px solid #16212f;
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
	border-color: #16212f;
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
	background: #16212f;
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
