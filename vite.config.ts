import { defaultTheme } from '@sveltepress/theme-default'
import { sveltepress } from '@sveltepress/vite'
import { defineConfig } from 'vite'

const config = defineConfig({
	plugins: [
		sveltepress({
			theme: defaultTheme({
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
