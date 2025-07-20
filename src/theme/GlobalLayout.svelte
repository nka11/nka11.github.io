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
  import './style.css'
    /**
   * @typedef {object} Props
   * @property {import('svelte').Snippet} [children] The content of the page
   */

  /** @type {Props & { [key: string]: any }} */
  const { children, ...rest } = $props()

  setContext(SVELTEPRESS_CONTEXT_KEY, {
    isDark,
  })

  let ajaxBar = $state()

  beforeNavigate(() => {
    ajaxBar?.start()
  })

  afterNavigate(() => {
    ajaxBar?.end()
    $sidebarCollapsed = true
    $navCollapsed = true
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

<Navbar />
<main class="w-full flex">
  <Sidebar />
  <div class="main-container flex-grow">
    <AjaxBar bind:this={ajaxBar} />
    {@render children?.()}
  </div>
</main>
<footer class="text-center p-4 text-sm text-gray-500">
  <p>Code licensed under Apache 2.0. Content licensed under CC BY-NC-SA 4.0.</p>
</footer>



<style>
  :root {
    --sidebar-width: 270px;
    --content-max-width: 784px;
    --nav-height: 64px;
    --c-brand: #646cff;
    --c-brand-light: #747bff;
    --c-bg: #f9f9f9;
    --c-bg-dark: #1a1a1a;
  }

  .main-container {
    padding: 0 2rem;
    max-width: var(--content-max-width);
    margin: var(--nav-height) auto 0;
  }

  main {
    padding-top: var(--nav-height);
  }

  :global(body) {
    background-color: var(--c-bg);
  }

  :global(body.dark) {
    background-color: var(--c-bg-dark);
    color: rgba(255, 255, 255, 0.87);
  }
</style>