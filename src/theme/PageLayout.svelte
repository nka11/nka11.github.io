<script>
  import { afterNavigate, beforeNavigate } from '$app/navigation'
  import { page } from '$app/stores'
  import { tick } from 'svelte'
  import siteConfig from 'virtual:sveltepress/site'
  // import themeOptions from 'virtual:sveltepress/theme-default'
  import EditPage from './EditPage.svelte'
  import Home from './Home.svelte'
  import HeroImage from './home/HeroImage.svelte'
  import LastUpdate from './LastUpdate.svelte'
  import { anchors, pages, showHeader, sidebar } from './layout'
  import PageSwitcher from './PageSwitcher.svelte'

  const routeId = $derived($page.route.id)

  // The frontmatter info. This would be injected by sveltepress
  const { fm, children, heroImage } = $props()

  const {
    title,
    description,
    pageType,
    lastUpdate,
    anchors: fmAnchors = [],
    home,
    sidebar: fmSidebar = true,
    header = true,
  } = fm

  $sidebar = fmSidebar
  $showHeader = header

  const isHome = $derived(routeId === '/') 

  anchors.set(fmAnchors)

  let ready = $state(false)

  beforeNavigate(() => {
    ready = false
  })

  afterNavigate(() => {
    tick().then(() => {
      ready = true
    })
  })
</script>

<svelte:head>
  <title>{title ? `${title} - ${siteConfig.title}` : siteConfig.title}</title>
  <meta name="description" content={description || siteConfig.description} />
</svelte:head>

{#snippet defaultHeroImage()}
  {#if fm.heroImage}
    <HeroImage heroImage={fm.heroImage} />
  {/if}
{/snippet}

{#if !isHome}
  <div class="theme-default--page-layout pb-4">
    <div class="content">
      {#if title}
        <h1 class="page-title">
          {title}
        </h1>
      {/if}
      {@render children?.()}
      <div class="meta" > 
        <!-- class:without-edit-link={!themeOptions.editLink} -->
        <!-- {#if themeOptions.editLink}
          <EditPage {pageType} />
        {/if} -->
        <LastUpdate {lastUpdate} />
      </div>
      {#if ready && $pages.length}
        <PageSwitcher />
      {/if}
    </div>
  </div>
{:else}
  {#if home !== false}
    <Home {...fm} {siteConfig} heroImage={heroImage ?? defaultHeroImage}></Home>
  {/if}
  {@render children?.()}
{/if}

<style>
:global(.theme-default--page-layout h1 .svp-title-anchor),
:global(.theme-default--page-layout h2 .svp-title-anchor),
:global(.theme-default--page-layout h3 .svp-title-anchor),
:global(.theme-default--page-layout h4 .svp-title-anchor),
:global(.theme-default--page-layout h5 .svp-title-anchor),
:global(.theme-default--page-layout h6 .svp-title-anchor) {
  position: absolute;
  left: 0;
  top: 50%;
  display: flex;
  align-items: center;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s;
  color: inherit;
  transform: translate(-100%, -50%);
}

:global(.theme-default--page-layout h2 .svp-title-anchor) {
  transform: translate(-100%, calc((-100% + 1rem) / 2));
}

:global(.theme-default--page-layout h1),
:global(.theme-default--page-layout h2),
:global(.theme-default--page-layout h3),
:global(.theme-default--page-layout h4),
:global(.theme-default--page-layout h5),
:global(.theme-default--page-layout h6) {
  position: relative;
}

:global(.theme-default--page-layout h2) {
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: #e5e7eb; /* Tailwind light-7 default */
  padding-top: 1rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

:global(.theme-default--page-layout h1:hover .svp-title-anchor),
:global(.theme-default--page-layout h2:hover .svp-title-anchor),
:global(.theme-default--page-layout h3:hover .svp-title-anchor),
:global(.theme-default--page-layout h4:hover .svp-title-anchor),
:global(.theme-default--page-layout h5:hover .svp-title-anchor),
:global(.theme-default--page-layout h6:hover .svp-title-anchor) {
  pointer-events: auto;
  opacity: 1;
}

:global(.theme-default--page-layout img) {
  max-width: 100%;
}

.content {
  width: 100%;
  padding-bottom: 2rem;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 640px) {
  .content {
    width: 90%;
    padding-bottom: 7rem;
  }
}

.page-title {
  margin-top: 0;
}

.meta {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 5rem;
}

@media (min-width: 640px) {
  .meta {
    flex-direction: row;
  }
}

.without-edit-link {
  justify-content: flex-end;
}

</style>
