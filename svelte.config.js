import adapterAuto from '@sveltejs/adapter-auto'
import adapterNode from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: process.env.VERCEL ? adapterAuto() : adapterNode(),
	},
	preprocess: vitePreprocess(),
}

export default config
