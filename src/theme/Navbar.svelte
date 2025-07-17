<script>
  import { page } from '$app/stores'
  import Github from './icons/Github.svelte'
  import { scrollDirection } from './layout'
  import Logo from './Logo.svelte'
  import MobileSubNav from './MobileSubNav.svelte'
  import NavbarMobile from './NavbarMobile.svelte'
  import NavItem from './NavItem.svelte'
  import ToggleDark from './ToggleDark.svelte'

  const routeId = $derived($page.route.id)
  const isHome = $derived(routeId === '/')
  const hasError = $derived($page.error)
</script>

<header class="header" class:hidden-in-mobile={$scrollDirection === 'down'}>
  <div class="header-inner">
    <div class="left">
      <NavbarMobile />
      {#if hasError || isHome}
        <div class="logo-container">
          <Logo />
        </div>
      {/if}
    </div>

    <nav class="nav-links" aria-label="Menu">
      <div class="navbar-pc">
        <div class="flex items-center">
          <NavItem title="Articles" to="/articles" />
        </div>
        
        <div class="flex items-center">
          <NavItem
            to="https://github.com/nka11/nka11.github.io"
            external
            icon
            builtInIcon
            title="Github"
          >
            <Github />
          </NavItem>
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
  }

  .dark .header {
    background-color: rgba(26, 26, 26, 0.8);
    border-bottom: 1px solid #333;
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
</style>
