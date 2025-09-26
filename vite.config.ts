import { sveltepress } from '@sveltepress/vite'
import { imagetools } from 'vite-imagetools'

import path from 'path'
import type { BundledLanguage } from 'shiki/langs'
import { defineConfig } from 'vite'

const config = defineConfig({
	plugins: [
		imagetools({
			include: ['**/*.{png,jpg,jpeg,webp,avif}'],
			exclude: ['**/images-optimized/**'],
			defaultDirectives: new URLSearchParams({
				format: 'webp;avif;original',
				quality: '80',
				width: '200;400;800;1200',
				withoutEnlargement: 'true'
			})
		}),
		sveltepress({

			theme: {
				globalLayout: path.resolve(__dirname, 'src/theme/GlobalLayout.svelte'),
				pageLayout: path.resolve(__dirname, 'src/theme/PageLayout.svelte'),
				name: '',
				highlighter: function (code: string, lang: BundledLanguage, meta?: string): string | Promise<string> {
					throw new Error('Function not implemented.')
				},
				vitePlugins: undefined
			},
			// theme: defaultTheme({
			// 	//globalLayout: path.resolve(__dirname, 'src/theme/GlobalLayout.svelte'),
			// 	navbar: [
			// 		{
			// 			title: "Articles",
			// 			to: "/articles"
			// 		}
			// 		// Add your navbar configs here
			// 	],
			// 	sidebar: {
					
			// 		// Add your sidebar configs here
			// 	},
			// 	github: 'https://github.com/nka11',
			// 	logo: "/nkaLogo-simple.svg",
			// 	//logo: '/sveltepress.svg',
			// 	themeColor: {
			// 		gradient: {
			// 			start: '#444444',
			// 			end: '#555555'

			// 		},
			// 		dark: '#222222',
			// 		light: '#ffffff'
			// 	}
			// }),
			siteConfig: {
				
				title: 'Nicolas Karageuzian',
				description: 'Programmer, Solution Architect and Free Software Enthusiast',
			},
		}),
	],
})

export default config
