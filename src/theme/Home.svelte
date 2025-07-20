<script>
  import ActionButton from "./ActionButton.svelte";
  import Feature from "./home/Feature.svelte";

  const {
    features = [],
    actions = [],
    tagline = "",
    siteConfig,
    heroImage,
  } = $props();
</script>

<div class="home-page">
  <div class="title">
    <div class="intro">
      <div class="gradient-title">
        {siteConfig.title}
      </div>
      <div class="description">
        {siteConfig.description}
      </div>
      {#if tagline}
        <div class="tagline">
          {tagline}
        </div>
      {/if}
    </div>
    {#if heroImage}
      {@render heroImage()}
    {/if}
  </div>

  <div class="actions">
    {#each actions as action}
      <ActionButton {...action} />
    {/each}
  </div>

  <div class="features">
    {#each features as fe, i}
      <Feature {...fe} {i} />
    {/each}
  </div>
</div>

<style>
  .home-page {
    width: 100%;
    max-width: 1152px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 1rem;
  }

  @media (min-width: 640px) {
    .home-page {
      width: 70vw;
      padding-left: 0;
      padding-right: 0;
    }
  }

  .title {
    font-size: 2.5rem; /* 40px (text-10) */
    font-weight: 700;
    line-height: 6rem; /* 96px (leading-24) */
    display: grid;
    grid-template-columns: repeat(12, 1fr);
  }

  @media (min-width: 640px) {
    .title {
      font-size: 4rem; /* 64px (text-16) */
    }
  }

  .description {
    font-size: 1.75rem; /* 28px (text-8) */
    line-height: 2.5rem; /* 40px (leading-10) */
  }

  @media (min-width: 640px) {
    .description {
      font-size: inherit;
    }
  }

  .intro {
    /* grid-column: span 12; */
    /* grid-row-start: 2; */
    text-align: center;
  }

  @media (min-width: 640px) {
    .intro {
      /* grid-column: span 12;
      grid-column-start: 1; */
      grid-row-start: 1;
      text-align: left;
    }
  }

  .gradient-title {
    /* Replace this with your actual gradient class or effect */
    /* background: linear-gradient(to right, #3b82f6, #9333ea); */
    background: linear-gradient(to right, #000, #777);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .tagline {
    color: #64748b; /* slate-500 */
    font-size: 1.5rem; /* text-6 = 24px */
    margin-top: 1rem;
    font-weight: 500;
    line-height: 2.25rem; /* 36px (leading-9) */
    font-style: normal;
  }

  @media (prefers-color-scheme: dark) {
    .tagline {
      color: #94a3b8; /* slate-400 in dark mode */
    }
  }

  .actions {
    display: grid;
    grid-template-columns: 1fr;
    padding-left: 2.5rem;
    padding-right: 2.5rem;
    gap: 1rem;
    margin-top: 1rem;
    justify-content: center;
    max-width: 320px;
    margin-left: auto;
    margin-right: auto;
  }

  @media (min-width: 640px) {
    .actions {
      display: flex;
      justify-content: flex-start;
      padding-left: 0;
      padding-right: 0;
      max-width: none;
    }
  }

  .features {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
  }

  @media (min-width: 640px) {
    .features {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 768px) {
    .features {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
