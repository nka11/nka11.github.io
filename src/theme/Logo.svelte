<script>
  // import siteConfig from 'virtual:sveltepress/site'
  // import themeOptions from 'virtual:sveltepress/theme-default'
  import NavItem from './NavItem.svelte'
  import { getPathFromBase, parseImageSrc } from './utils'
</script>

<NavItem to={getPathFromBase('/')} title="Nicolas Karageuzian">
   <!-- {#if themeOptions.logo} -->
    <img
      class="logo"
      height="32"
      src={parseImageSrc("/nkaLogo-simple.svg")}
      alt="Nicolas Karageuzian"
    />
    <span class="title">
      Nicolas Karageuzian
    </span>
  <!-- {/if}  -->
</NavItem>

<style>
  .logo {
    height: 32px;
    width: auto;
    display: inline-block;
    vertical-align: middle;
  }
  .title {
    margin-left: 0.6rem;
    font-family: var(--font-display);
    font-weight: 700;
    letter-spacing: -0.005em;
    color: var(--ink);
    vertical-align: middle;
  }
</style>
