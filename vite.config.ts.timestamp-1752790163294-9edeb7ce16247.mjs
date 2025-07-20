// vite.config.ts
import { sveltepress } from "file:///app/node_modules/@sveltepress/vite/dist/index.mjs";
import path from "path";
import Unocss from "file:///app/node_modules/unocss/dist/vite.mjs";
import { presetAttributify, presetIcons, presetUno } from "file:///app/node_modules/unocss/dist/index.mjs";
import { defineConfig } from "file:///app/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "/app";
var config = defineConfig({
  plugins: [
    Unocss({
      presets: [
        presetAttributify(),
        presetIcons(),
        presetUno()
      ]
    }),
    sveltepress({
      theme: {
        globalLayout: path.resolve(__vite_injected_original_dirname, "src/theme/GlobalLayout.svelte"),
        name: "",
        pageLayout: "",
        vitePlugins: [],
        highlighter: function(code, lang, meta) {
          throw new Error("Function not implemented.");
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
        title: "Nicolas Karageuzian",
        description: "Programmer, Solution Architect and Free Software Enthusiast"
      }
    })
  ]
});
var vite_config_default = config;
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9hcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZhdWx0VGhlbWUgfSBmcm9tICdAc3ZlbHRlcHJlc3MvdGhlbWUtZGVmYXVsdCdcbmltcG9ydCB7IHN2ZWx0ZXByZXNzIH0gZnJvbSAnQHN2ZWx0ZXByZXNzL3ZpdGUnXG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgdHlwZSB7IEJ1bmRsZWRMYW5ndWFnZSB9IGZyb20gJ3NoaWtpL2xhbmdzJ1xuaW1wb3J0IFVub2NzcyBmcm9tICd1bm9jc3Mvdml0ZSdcbmltcG9ydCB7IHByZXNldEF0dHJpYnV0aWZ5LCBwcmVzZXRJY29ucywgcHJlc2V0VW5vIH0gZnJvbSAndW5vY3NzJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcblxuXG5jb25zdCBjb25maWcgPSBkZWZpbmVDb25maWcoe1xuXHRwbHVnaW5zOiBbXG5cdFx0VW5vY3NzKHtcblx0XHRcdHByZXNldHM6IFtcblx0XHRcdFx0cHJlc2V0QXR0cmlidXRpZnkoKSxcblx0XHRcdFx0cHJlc2V0SWNvbnMoKSxcblx0XHRcdFx0cHJlc2V0VW5vKCksXG5cdFx0XHRdXG5cdFx0fSksXG5cdFx0c3ZlbHRlcHJlc3Moe1xuXHRcdFx0dGhlbWU6IHtcblx0XHRcdFx0Z2xvYmFsTGF5b3V0OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL3RoZW1lL0dsb2JhbExheW91dC5zdmVsdGUnKSxcblx0XHRcdFx0bmFtZTogJycsXG5cdFx0XHRcdHBhZ2VMYXlvdXQ6ICcnLFxuXHRcdFx0XHR2aXRlUGx1Z2luczogW10sXG5cdFx0XHRcdGhpZ2hsaWdodGVyOiBmdW5jdGlvbiAoY29kZTogc3RyaW5nLCBsYW5nOiBCdW5kbGVkTGFuZ3VhZ2UsIG1ldGE/OiBzdHJpbmcpOiBzdHJpbmcgfCBQcm9taXNlPHN0cmluZz4ge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignRnVuY3Rpb24gbm90IGltcGxlbWVudGVkLicpXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQvLyB0aGVtZTogZGVmYXVsdFRoZW1lKHtcblx0XHRcdC8vIFx0Ly9nbG9iYWxMYXlvdXQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvdGhlbWUvR2xvYmFsTGF5b3V0LnN2ZWx0ZScpLFxuXHRcdFx0Ly8gXHRuYXZiYXI6IFtcblx0XHRcdC8vIFx0XHR7XG5cdFx0XHQvLyBcdFx0XHR0aXRsZTogXCJBcnRpY2xlc1wiLFxuXHRcdFx0Ly8gXHRcdFx0dG86IFwiL2FydGljbGVzXCJcblx0XHRcdC8vIFx0XHR9XG5cdFx0XHQvLyBcdFx0Ly8gQWRkIHlvdXIgbmF2YmFyIGNvbmZpZ3MgaGVyZVxuXHRcdFx0Ly8gXHRdLFxuXHRcdFx0Ly8gXHRzaWRlYmFyOiB7XG5cdFx0XHRcdFx0XG5cdFx0XHQvLyBcdFx0Ly8gQWRkIHlvdXIgc2lkZWJhciBjb25maWdzIGhlcmVcblx0XHRcdC8vIFx0fSxcblx0XHRcdC8vIFx0Z2l0aHViOiAnaHR0cHM6Ly9naXRodWIuY29tL25rYTExJyxcblx0XHRcdC8vIFx0bG9nbzogXCIvbmthTG9nby1zaW1wbGUuc3ZnXCIsXG5cdFx0XHQvLyBcdC8vbG9nbzogJy9zdmVsdGVwcmVzcy5zdmcnLFxuXHRcdFx0Ly8gXHR0aGVtZUNvbG9yOiB7XG5cdFx0XHQvLyBcdFx0Z3JhZGllbnQ6IHtcblx0XHRcdC8vIFx0XHRcdHN0YXJ0OiAnIzQ0NDQ0NCcsXG5cdFx0XHQvLyBcdFx0XHRlbmQ6ICcjNTU1NTU1J1xuXG5cdFx0XHQvLyBcdFx0fSxcblx0XHRcdC8vIFx0XHRkYXJrOiAnIzIyMjIyMicsXG5cdFx0XHQvLyBcdFx0bGlnaHQ6ICcjZmZmZmZmJ1xuXHRcdFx0Ly8gXHR9XG5cdFx0XHQvLyB9KSxcblx0XHRcdHNpdGVDb25maWc6IHtcblx0XHRcdFx0XG5cdFx0XHRcdHRpdGxlOiAnTmljb2xhcyBLYXJhZ2V1emlhbicsXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiAnUHJvZ3JhbW1lciwgU29sdXRpb24gQXJjaGl0ZWN0IGFuZCBGcmVlIFNvZnR3YXJlIEVudGh1c2lhc3QnLFxuXHRcdFx0fSxcblx0XHR9KSxcblx0XSxcbn0pXG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZ1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsbUJBQW1CO0FBRTVCLE9BQU8sVUFBVTtBQUVqQixPQUFPLFlBQVk7QUFDbkIsU0FBUyxtQkFBbUIsYUFBYSxpQkFBaUI7QUFDMUQsU0FBUyxvQkFBb0I7QUFQN0IsSUFBTSxtQ0FBbUM7QUFVekMsSUFBTSxTQUFTLGFBQWE7QUFBQSxFQUMzQixTQUFTO0FBQUEsSUFDUixPQUFPO0FBQUEsTUFDTixTQUFTO0FBQUEsUUFDUixrQkFBa0I7QUFBQSxRQUNsQixZQUFZO0FBQUEsUUFDWixVQUFVO0FBQUEsTUFDWDtBQUFBLElBQ0QsQ0FBQztBQUFBLElBQ0QsWUFBWTtBQUFBLE1BQ1gsT0FBTztBQUFBLFFBQ04sY0FBYyxLQUFLLFFBQVEsa0NBQVcsK0JBQStCO0FBQUEsUUFDckUsTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osYUFBYSxDQUFDO0FBQUEsUUFDZCxhQUFhLFNBQVUsTUFBYyxNQUF1QixNQUF5QztBQUNwRyxnQkFBTSxJQUFJLE1BQU0sMkJBQTJCO0FBQUEsUUFDNUM7QUFBQSxNQUNEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUEyQkEsWUFBWTtBQUFBLFFBRVgsT0FBTztBQUFBLFFBQ1AsYUFBYTtBQUFBLE1BQ2Q7QUFBQSxJQUNELENBQUM7QUFBQSxFQUNGO0FBQ0QsQ0FBQztBQUVELElBQU8sc0JBQVE7IiwKICAibmFtZXMiOiBbXQp9Cg==
