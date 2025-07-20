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
    --at-apply: 'h-[32px]';
  }
  .title {
    --at-apply: 'font-600 ml-2';
  }
</style>
