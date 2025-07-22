<script>
  import { page } from '$app/stores'
    import CvMenu from '$lib/components/schemaorgcv/CVMenu.svelte';
    import { namedNode } from 'oxigraph';
  import Github from './icons/Github.svelte'
  import { scrollDirection } from './layout'
  import Logo from './Logo.svelte'
  import MobileSubNav from './MobileSubNav.svelte'
  import NavbarMobile from './NavbarMobile.svelte'
  import NavItem from './NavItem.svelte'
  import LanguageSwitcher from './LanguageSwitcher.svelte'
  import ToggleDark from './ToggleDark.svelte'

  const routeId = $derived($page.route.id)
  const isHome = $derived(routeId === '/')
  const isCv = $derived(routeId?.startsWith('/cv'))
  const hasError = $derived($page.error)
  // console.log($page)


</script>

<header class="header {scrollDirection === 'down' ? 'hidden-in-mobile' : ''}">
  <div class="header-inner">
    <div class="left">
      <NavbarMobile />
      {#if !isHome}
        <div class="logo-container">
          <Logo />
        </div>
      {/if}
      {#if isCv}
        <div class="logo-container">
          <!-- <CvMenu person={person}/> -->
        </div>
      {/if}
    </div>

    <nav class="nav-links" aria-label="Menu">
      <div class="navbar-pc">
        <div class="nav-item">
          <NavItem title="Articles" to="/articles" />
        </div>
        
        <div class="nav-item">
          <NavItem
            to="https://github.com/nka11/nka11.github.io"
            external
            icon
            builtInIcon
            title="Github"
          >
            <Github />
          </NavItem>
          <LanguageSwitcher />
          <ToggleDark />
        </div>
      </div>
    </nav>
  </div>
  {#if !isHome}
    <MobileSubNav />
  {/if}
</header>

<style>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--nav-height);
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(5px);
    z-index: 100;
    border-bottom: 1px solid #eaecef;
    transition: transform 0.3s ease;
  }

  .dark .header {
    background-color: rgba(26, 26, 26, 0.8);
    border-bottom: 1px solid #333;
  }

  .hidden-in-mobile {
    transform: translateY(-100%);
  }

  .header-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 0 2rem;
    max-width: calc(var(--content-max-width) + var(--sidebar-width));
    margin: 0 auto;
  }

  .left {
    display: flex;
    align-items: center;
  }

  .logo-container {
    display: none;
  }

  @media (min-width: 640px) {
    .logo-container {
      display: block;
    }
  }

  .nav-links {
    display: flex;
    align-items: center;
  }

  .navbar-pc {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .nav-item {
    display: flex;
    align-items: center;
  }
</style>
