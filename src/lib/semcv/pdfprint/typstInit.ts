import { $typst, TypstSnippet } from '@myriaddreamin/typst.ts/contrib/snippet';

let initialized = false;

const COMPILER_WASM_URL = '/wasm/typst_ts_web_compiler_bg.wasm';
const RENDERER_WASM_URL = '/wasm/typst_ts_renderer_bg.wasm';

const NOTO_SANS_REGULAR = 'https://fonts.gstatic.com/s/notosans/v39/o-0mIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyD9A-9a6Vc.ttf';
const NOTO_SANS_BOLD = 'https://fonts.gstatic.com/s/notosans/v39/o-0mIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyAjBe9a6Vc.ttf';

export async function initTypstCompiler(): Promise<void> {
  if (initialized) return;

  // Point to local WASM files to avoid Vite's inability to resolve
  // bare WASM imports from the typst-ts-web-compiler package
  $typst.setCompilerInitOptions({
    getModule: () => fetch(COMPILER_WASM_URL),
  });

  $typst.setRendererInitOptions({
    getModule: () => fetch(RENDERER_WASM_URL),
  });

  // Preload Noto Sans from Google Fonts
  $typst.use(
    TypstSnippet.preloadFontFromUrl(NOTO_SANS_REGULAR),
    TypstSnippet.preloadFontFromUrl(NOTO_SANS_BOLD),
    TypstSnippet.preloadFontAssets({ assets: ['text'] })
  );

  initialized = true;
}

export { $typst };
