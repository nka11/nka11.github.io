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
  <p>Code licensed under Apache 2.0. Content licensed under CC BY-NC-SA 4.0.</p>
</footer>

<style>


  .footer {
    text-align: center;
    padding: 1rem;
    font-size: 0.875rem;
    color: #6b7280; /* gris clair */
  }

  @media (prefers-color-scheme: dark) {
    .footer {
      color: #a1a1aa; /* gris clair en thème sombre */
    }
  }
:root {
  --sidebar-width: 270px;
  --content-max-width: 1280px;
  --nav-height: 64px;
  --c-brand: #646cff;
  --c-brand-light: #747bff;
  --c-bg: #f9f9f9;
  --c-bg-dark: #1a1a1a;

  /* Additional spacing for responsiveness */
  --padding-desktop: 2rem;
  --padding-tablet: 1.5rem;
  --padding-mobile: 1rem;
}

:global(body) {
  background-color: var(--c-bg);
  font-family:
      'Inter var experimental',
      'Inter var',
      'Inter',
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      'Helvetica Neue',
      Helvetica,
      Arial,
      'Noto Sans',
      sans-serif,
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
      'Noto Color Emoji';
}

:global(body.dark) {
  background-color: var(--c-bg-dark);
  color: rgba(255, 255, 255, 0.87);
}


</style>