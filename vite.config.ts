import { sveltepress } from '@sveltepress/vite'

import path from 'path'
import type { BundledLanguage } from 'shiki/langs'
import Unocss from 'unocss/vite'
import { presetAttributify, presetIcons, presetUno, transformerDirectives } from 'unocss'
import { defineConfig } from 'vite'
import sveltePreprocess from 'svelte-preprocess'
import extractorSvelte from '@unocss/extractor-svelte'

const config = defineConfig({
	plugins: [
		Unocss({
			presets: [
				presetAttributify(),
				presetIcons(),
				presetUno(),
			],
			extractors: [
				extractorSvelte(),
			],
			transformers: [transformerDirectives()],
		}),
		sveltepress({

			theme: {
				globalLayout: path.resolve(__dirname, 'src/theme/GlobalLayout.svelte'),
				name: '',
				pageLayout: '',
				highlighter: function (code: string, lang: BundledLanguage, meta?: string): string | Promise<string> {
					throw new Error('Function not implemented.')
				}
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
