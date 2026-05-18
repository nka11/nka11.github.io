<script lang="ts">
  import { afterNavigate, beforeNavigate } from '$app/navigation'

    import { onMount, setContext } from "svelte";
    import Navbar from "./Navbar.svelte";
    import Sidebar from "./Sidebar.svelte";
    import { SVELTEPRESS_CONTEXT_KEY } from "./context";
    import {
    anchors,
    isDark,
    navCollapsed,
    oldScrollY,
    // resolveSidebar,
    scrollY,
    showHeader,
    sidebar,
    sidebarCollapsed,
  } from './layout'
  import AjaxBar from './AjaxBar.svelte'
  import CalPopup from '$lib/components/CalPopup.svelte'
  import './style.css'
    /**
   * @typedef {object} Props
   * @property {import('svelte').Snippet} [children] The content of the page
   */

  /** @type {Props & { [key: string]: any }} */
  const { children, ...rest } = $props()
  // console.log(rest)
  setContext(SVELTEPRESS_CONTEXT_KEY, {
    isDark,
  })


  let pwaComponent = $state()

  onMount(async () => {
    // if (themeOptions.pwa)
    //   pwaComponent = (await import('./pwa/Pwa.svelte')).default
  })
</script>

<svelte:head>

</svelte:head>

<svelte:window
  onscroll={() => ($oldScrollY = $scrollY)}
  bind:scrollY={$scrollY}
/>


{@render children?.()}

<footer class="footer">
  <div class="footer-inner">
    <div class="footer-zone footer-identity">
      <span class="footer-mark">§ NK</span>
      <span class="footer-line">© {new Date().getFullYear()} · Nicolas Karageuzian</span>
    </div>
    <div class="footer-zone footer-licences">
      <span class="footer-line">
        <span class="footer-label">Code</span> Apache 2.0
        <span class="footer-sep">·</span>
        <span class="footer-label">Contenu</span> CC BY-NC-SA 4.0
      </span>
    </div>
    <div class="footer-zone footer-source">
      <a href="https://github.com/nka11/nka11.github.io" target="_blank" rel="noopener noreferrer" class="footer-line footer-link">
        github.com/nka11 ↗
      </a>
    </div>
  </div>
</footer>

<style>


  .footer {
    border-top: 1px solid var(--ink-faint);
    background: var(--paper);
    margin-top: var(--space-8, 72px);
  }

  .footer-inner {
    max-width: var(--content-max-width);
    margin: 0 auto;
    padding: var(--space-5, 24px) var(--padding-desktop, 2rem);
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--space-5, 24px);
    align-items: baseline;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-soft);
  }

  .footer-zone {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3, 12px);
    align-items: baseline;
  }
  .footer-licences { justify-content: center; text-align: center; }
  .footer-source   { justify-content: flex-end; text-align: right; }

  .footer-mark {
    color: var(--or);
    font-weight: 600;
    letter-spacing: 0.16em;
  }
  .footer-line { white-space: nowrap; }
  .footer-label {
    color: var(--ink);
    font-weight: 500;
  }
  .footer-sep { opacity: 0.4; margin: 0 0.25rem; }

  .footer-link {
    color: var(--ink-soft);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: color 0.2s ease, border-color 0.2s ease;
  }
  .footer-link:hover {
    color: var(--or);
    border-bottom-color: var(--or);
  }

  @media (max-width: 720px) {
    .footer-inner {
      grid-template-columns: 1fr;
      gap: var(--space-3, 12px);
      padding: var(--space-4, 16px) var(--padding-mobile, 1rem);
    }
    .footer-zone,
    .footer-licences,
    .footer-source {
      justify-content: flex-start;
      text-align: left;
    }
  }

  @media print {
    .footer { display: none; }
  }

:root {
  /* Layout */
  --sidebar-width: 270px;
  --content-max-width: 1280px;
  --nav-height: 64px;
  --padding-desktop: 2rem;
  --padding-tablet: 1.5rem;
  --padding-mobile: 1rem;

  /* Type — sovereign-civic system, modernized */
  --font-display: 'Marianne', 'Marianne Web', ui-sans-serif, system-ui, sans-serif;
  --font-body: 'Inter Tight', 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, 'Cascadia Mono', 'Fira Mono', Consolas, monospace;

  /* Color — light (canonical) : Modern minimal — near-white paper + near-black ink + or */
  --paper: #FAFAFA;
  --paper-soft: #F2F2F0;
  --ink: #0A0A0A;
  --ink-soft: #525252;
  --ink-faint: rgba(10, 10, 10, 0.10);
  --rule: #1A1A1A;
  --or: #B8893C;
  --or-soft: #D4A85C;
  /* Cinnabar reserved exclusively for warnings/alerts */
  --cinnabar: #B6311F;

  /* Geometry */
  --radius-0: 0;
  --radius-1: 2px;
  --radius-2: 4px;

  /* Spacing rhythm */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 72px;

  /* Legacy aliases — rewire old tokens to the new system so unswept components stay coherent */
  --c-bg: var(--paper);
  --c-bg-dark: #15110B;
  --c-brand: var(--or);
  --c-brand-light: var(--or-soft);
}

:global(html.dark),
:global(html[data-theme='dark']) {
  --paper: #0A0A0A;
  --paper-soft: #141414;
  --ink: #FAFAFA;
  --ink-soft: #A3A3A3;
  --ink-faint: rgba(250, 250, 250, 0.10);
  --rule: #E5E5E5;
  --or: #D4A85C;
  --or-soft: #E6BE73;
  --cinnabar: #D65A47;
}

:global(body) {
  background-color: var(--paper);
  color: var(--ink);
  font-family: var(--font-body);
  font-feature-settings: 'ss01', 'kern';
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

:global(body.dark) {
  background-color: var(--paper);
  color: var(--ink);
}

:global(h1),
:global(h2),
:global(h3),
:global(h4),
:global(h5),
:global(h6) {
  font-family: var(--font-display);
  color: var(--ink);
  letter-spacing: -0.01em;
}

:global(code),
:global(kbd),
:global(samp),
:global(pre) {
  font-family: var(--font-mono);
}

:global(a) {
  color: var(--or);
  text-decoration-thickness: 1px;
  text-underline-offset: 0.18em;
}

:global(a:hover) {
  color: var(--or-soft);
}

:global(::selection) {
  background: var(--or);
  color: var(--paper);
}


</style>