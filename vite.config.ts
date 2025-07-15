import { defaultTheme } from '@sveltepress/theme-default'
import { sveltepress } from '@sveltepress/vite'

import path from 'path'
import Unocss from 'unocss/vite'

import { defineConfig } from 'vite'


const config = defineConfig({
	plugins: [
		Unocss(),
		sveltepress({
			// theme: {
			// 	globalLayout: path.resolve(__dirname, 'src/theme/GlobalLayout.svelte'),
			// },
			theme: defaultTheme({
				//globalLayout: path.resolve(__dirname, 'src/theme/GlobalLayout.svelte'),
				navbar: [
					{
						title: "Articles",
						to: "/articles"
					}
					// Add your navbar configs here
				],
				sidebar: {
					
					// Add your sidebar configs here
				},
				github: 'https://github.com/nka11',
				logo: "/nkaLogo-simple.svg",
				//logo: '/sveltepress.svg',
				themeColor: {
					gradient: {
						start: '#444444',
						end: '#555555'

					},
					dark: '#222222',
					light: '#ffffff'
				}
			}),
			siteConfig: {
				
				title: 'Nicolas Karageuzian',
				description: 'Programmer, Solution Architect and Free Software Enthusiast',
			},
		}),
	],
})

export default config
