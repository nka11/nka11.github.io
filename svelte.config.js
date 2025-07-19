import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { mdsvex } from 'mdsvex';
import sveltePreprocess from 'svelte-preprocess';

/**
 * @type {import('@sveltejs/kit').Config}
 */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		vitePreprocess(),
		sveltePreprocess({

		}),
		mdsvex({
			extensions: ['.md'],
			// layout: {
			// 	atticles: './src/routes/articles/_layout.svelte' // facultatif
			// }
		})
	],
	// To activate quality
	// compilerOptions: {
	// 	runes: true,
	// },
	kit: {
		adapter: adapter({
			pages: 'dist',
		}),
		alias: {
			'$lib': './src/lib',
			'$lib/*': './src/lib/*'
		}
	},
}

export default config
