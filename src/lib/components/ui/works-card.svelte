<script lang="ts">
import type { Pathname } from '$app/types'

import { floatUp } from '$lib/actions'
import { spring } from 'motion'
import { animate } from 'motion/mini'

type Properties = {
	isLabelReversed?: boolean
	label: string
	path?: Pathname
	src?: string
	style?: string
	variant: 'primary' | 'secondary'
}

let { isLabelReversed = false, label, path, src, style, variant = 'primary' }: Properties = $props()

let labelBoxElement: HTMLDivElement

function handleMouseEnter() {
	if (!labelBoxElement) return
	animate(labelBoxElement, { scale: 1.02 }, { bounce: 0.4, duration: 0.6, type: spring })
}

function handleMouseLeave() {
	if (!labelBoxElement) return
	animate(labelBoxElement, { scale: 1 }, { bounce: 0.3, duration: 0.5, type: spring })
}
</script>

<svelte:element this={path ? 'a' : 'div'} href={path} class={['works-card', variant]} {style} role={path ? undefined : 'group'} use:floatUp onmouseenter={handleMouseEnter} onmouseleave={handleMouseLeave}>
	{#if src}
		<img {src} alt={label} class="image" />
	{/if}

	<div bind:this={labelBoxElement} class={['label-box', isLabelReversed && 'reversed']}>
		<h3 class="label">{label}</h3>
	</div>
</svelte:element>

<style>
.works-card {
	position: relative;
	width: 100%;
	height: 368px;
	padding: 0%;
	overflow: hidden;
	transition: box-shadow 0.3s ease-in-out;
}

.works-card:hover {
	box-shadow: 0 8px 16px rgb(0 0 0 / 10%);
}

a.works-card {
	display: block;
	color: inherit;
	text-decoration: none;
}

.primary {
	background-color: #566f8f;
}

.secondary {
	background-color: #a8bfdc;
}

.image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition:
		transform 0.3s ease-in-out,
		filter 0.3s ease-in-out;
}

.works-card:hover .image {
	filter: brightness(0.6);
	transform: scale(1.02);
}

.label-box {
	position: absolute;
	bottom: 0;
	left: 0;
	display: flex;
	align-items: center;
	width: 335px;
	height: 51px;
	padding: 10px 0 10px 30px;
	background-color: white;
	border-radius: 0 26px 0 0;
	transform-origin: bottom left;
}

.label-box.reversed {
	right: 0;
	left: auto;
	justify-content: flex-end;
	padding: 10px 30px 10px 0;
	border-radius: 26px 0 0;
	transform-origin: bottom right;
}

.label {
	margin: 0;
	font-family: var(--font-heading-bold);
	font-size: 18px;
	line-height: 20px;
	letter-spacing: -0.01em;
}

a.works-card .label {
	position: relative;
	display: inline-block;
}

a.works-card .label::after {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 1px;
	content: '';
	background-color: currentcolor;
	transform: scaleX(0);
	transform-origin: left;
	transition: transform 0.3s ease-in-out;
}

a.works-card:hover .label::after {
	transform: scaleX(1);
}
</style>
