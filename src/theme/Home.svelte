<script>
  import ActionButton from "./ActionButton.svelte";
  import Feature from "./home/Feature.svelte";
  import IconifyIcon from "./IconifyIcon.svelte";
  import { T } from "$lib/i18n";

  const {
    features = [],
    actions = [],
    tagline = "",
    siteConfig,
    heroImage,
  } = $props();

  const headlineOfferings = [
    { code: 'HL · 01', key: 'virtualized', collection: 'mdi', name: 'server-network', flavour: 'cinnabar' },
    { code: 'HL · 02', key: 'iam_sso',     collection: 'mdi', name: 'shield-key',     flavour: 'forest' },
    { code: 'HL · 03', key: 'ebios_nis2',  collection: 'mdi', name: 'gavel',          flavour: 'forest' },
    { code: 'HL · 04', key: 'cicd',        collection: 'mdi', name: 'pipe',           flavour: 'cinnabar' },
    { code: 'HL · 05', key: 'semantic',    collection: 'mdi', name: 'graph-outline',  flavour: 'ink' },
    { code: 'HL · 06', key: 'genai',       collection: 'mdi', name: 'robot-industrial', flavour: 'cinnabar' }
  ];
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..900,30..100;1,9..144,300..900,30..100&family=IBM+Plex+Mono:wght@400;500&display=swap"
  />
</svelte:head>

<div class="home-page">
  <section class="slide hero-slide">
    <div class="title">
      <div class="intro">
        <div class="gradient-title">
          {$T('home.title') || siteConfig.title}
        </div>
        <div class="description">
          {$T('home.description') || siteConfig.description}
        </div>
        {#if tagline}
          <div class="tagline">
            {$T('home.tagline') || tagline}
          </div>
        {/if}
      </div>
      {#if heroImage}
        {@render heroImage()}
      {/if}
    </div>

    <div class="actions">
      {#each actions as action}
        <ActionButton {...action} label={action.label.includes('Github') ? $T('home.actions.github') : action.label} />
      {/each}
    </div>

    <div class="features">
      {#each features as fe, i}
        <Feature {...fe} {i} />
      {/each}
    </div>
  </section>

  <section class="slide training-slide">
    <div class="training-content">
      <div class="training-meta">
        <span class="mono-tag">§ TRAINING · 06 HEADLINE OFFERINGS</span>
      </div>
      <h2 class="training-title">{$T('home.training.title')}</h2>
      <p class="training-subtitle">{$T('home.training.subtitle')}</p>

      <ol class="headline-grid">
        {#each headlineOfferings as o, i}
          <li class="headline-card flav-{o.flavour}" style="--idx:{i};">
            <a class="card-link" href="/trainings#{o.code.replace(/\W+/g, '-').toLowerCase()}">
              <div class="card-top">
                <span class="card-code">{o.code}</span>
                <span class="card-icon">
                  <IconifyIcon collection={o.collection} name={o.name} />
                </span>
              </div>
              <h3 class="card-title">{$T(`home.training.headline.${o.key}.title`)}</h3>
              <p class="card-lead">{$T(`home.training.headline.${o.key}.lead`)}</p>
              <span class="card-cta">{$T('home.training.headline.view')} →</span>
            </a>
          </li>
        {/each}
      </ol>

      <div class="training-footer">
        <p>{$T('home.training.description')}</p>
        <p class="ade-mention">
          <a href="https://deepthought-solutions.com/" target="_blank" rel="noopener noreferrer">
            {$T('home.training.ade')}
          </a>
        </p>
        <div class="mt-8 cta-row">
          <ActionButton
            label={$T('home.training.full_catalog')}
            to="/trainings"
            type="primary"
          />
          <ActionButton
            label={$T('home.training.catalog')}
            to="https://deepthought-solutions.com/"
            external={true}
          />
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  .home-page {
    width: 100%;
    max-width: 1152px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 0;
    padding-right: 0;
  }
  
  .slide {
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2rem 0;
  }

  @media (min-width: 640px) {
    .home-page {
      width: 70vw;
      padding-left: 1rem;
      padding-right: 1rem;
      padding-top: 1rem;
    }
  }

  .title {
    font-size: 2.5rem; /* 40px (text-10) */
    font-weight: 700;
  }
  
  @media (min-width: 640px) {
    .title {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      line-height: 6rem; /* 96px (leading-24) */
      font-size: 3.5rem; /* 64px (text-16) */
    }
  }

  .description {
    font-size: 1.75rem; /* 28px (text-8) */
    line-height: 2.5rem; /* 40px (leading-10) */
  }

  .intro {
    grid-column: span 7/span 7;
    grid-row-start: 1;
    text-align: left;
  }

  .gradient-title {
    background: linear-gradient(to right, #000, #777);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (prefers-color-scheme: dark) {
    .gradient-title {
      background: linear-gradient(to right, #fff, #aaa);
      -webkit-background-clip: text;
    }
  }

  .tagline {
    color: #64748b; /* slate-500 */
    font-size: 1.5rem; /* text-6 = 24px */
    margin-top: 1rem;
    font-weight: 400;
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

  /* Training Slide — editorial prospectus aesthetic */
  .training-slide {
    --ink: #1a1410;
    --ink-soft: #4a3f37;
    --cinnabar: #b6311f;
    --forest: #2f4a35;
    --gold: #b88a3e;
    --rule: rgba(26, 20, 16, 0.18);
    border-top: 2px solid var(--ink);
    margin-top: 4rem;
    padding-top: 3rem;
  }

  :global(.dark) .training-slide {
    --ink: #ece5d5;
    --ink-soft: #b9b1a0;
    --rule: rgba(236, 229, 213, 0.22);
    border-top: 2px solid var(--ink);
  }

  .training-meta {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 1.25rem;
  }

  .mono-tag {
    font-family: 'IBM Plex Mono', ui-monospace, monospace;
    font-size: 0.72rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--cinnabar);
  }

  .training-title {
    font-size: clamp(2.2rem, 5vw, 3.4rem);
    font-weight: 350;
    font-style: italic;
    line-height: 1;
    letter-spacing: -0.02em;
    margin: 0 0 0.5rem;
    color: var(--ink);
    text-align: left;
    font-family: 'Fraunces', 'Times New Roman', serif;
    font-variation-settings: 'opsz' 144, 'SOFT' 90;
  }

  .training-subtitle {
    font-size: 1.05rem;
    color: var(--ink-soft);
    text-align: left;
    margin: 0 0 2.5rem;
    max-width: 60ch;
    line-height: 1.5;
    font-family: 'Fraunces', 'Times New Roman', serif;
  }

  .headline-grid {
    list-style: none;
    padding: 0;
    margin: 0 0 3rem;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 1rem;
    counter-reset: hl;
  }

  .headline-card {
    grid-column: span 6;
    position: relative;
    border: 1px solid var(--ink);
    background: rgba(255, 255, 255, 0.4);
    transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1), background 0.3s;
    animation: hlrise 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) backwards;
    animation-delay: calc(var(--idx) * 70ms);
    overflow: hidden;
  }

  :global(.dark) .headline-card {
    background: rgba(0, 0, 0, 0.25);
  }

  .headline-card::after {
    content: "";
    position: absolute;
    inset: 5px;
    border: 1px solid var(--rule);
    pointer-events: none;
  }

  .headline-card:hover {
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.7);
  }
  :global(.dark) .headline-card:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  @media (min-width: 980px) {
    .headline-card:nth-child(1) { grid-column: span 7; }
    .headline-card:nth-child(2) { grid-column: span 5; }
    .headline-card:nth-child(3) { grid-column: span 4; }
    .headline-card:nth-child(4) { grid-column: span 4; }
    .headline-card:nth-child(5) { grid-column: span 4; }
    .headline-card:nth-child(6) { grid-column: span 12; }
  }
  @media (max-width: 760px) {
    .headline-card { grid-column: span 12 !important; }
  }

  .card-link {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.6rem 1.5rem 1.25rem;
    text-decoration: none;
    color: inherit;
    height: 100%;
  }

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .card-code {
    font-family: 'IBM Plex Mono', ui-monospace, monospace;
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--cinnabar);
  }
  .flav-forest .card-code { color: var(--forest); }
  .flav-ink .card-code { color: var(--gold); }

  .card-icon {
    font-size: 1.6rem;
    color: var(--ink);
    opacity: 0.55;
    transition: opacity 0.3s, transform 0.3s;
  }
  .headline-card:hover .card-icon {
    opacity: 1;
    transform: rotate(-4deg) scale(1.08);
  }

  .card-title {
    font-family: 'Fraunces', 'Times New Roman', serif;
    font-weight: 350;
    font-size: clamp(1.25rem, 2vw, 1.65rem);
    line-height: 1.08;
    letter-spacing: -0.02em;
    margin: 0;
    color: var(--ink);
    max-width: 22ch;
    font-variation-settings: 'opsz' 144, 'SOFT' 50;
  }
  .card-title::after {
    content: " ●";
    color: var(--cinnabar);
    font-size: 0.45em;
    vertical-align: 0.5em;
  }
  .flav-forest .card-title::after { color: var(--forest); }
  .flav-ink .card-title::after { color: var(--gold); }

  .card-lead {
    font-family: 'Fraunces', 'Times New Roman', serif;
    font-style: italic;
    color: var(--ink-soft);
    font-size: 0.95rem;
    line-height: 1.4;
    margin: 0;
    max-width: 36ch;
    font-variation-settings: 'opsz' 14, 'SOFT' 70;
  }

  .card-cta {
    margin-top: auto;
    padding-top: 0.5rem;
    font-family: 'IBM Plex Mono', ui-monospace, monospace;
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink);
    border-top: 1px dotted var(--rule);
    transition: color 0.3s, letter-spacing 0.3s;
  }
  .headline-card:hover .card-cta {
    color: var(--cinnabar);
    letter-spacing: 0.18em;
  }

  .training-footer {
    text-align: left;
    max-width: 800px;
    margin: 0;
    padding-top: 1rem;
    border-top: 1px solid var(--rule);
  }
  .training-footer p {
    font-family: 'Fraunces', 'Times New Roman', serif;
    color: var(--ink-soft);
    margin: 0.5rem 0;
    font-size: 1rem;
    line-height: 1.5;
  }

  .ade-mention a {
    font-weight: 500;
    color: var(--cinnabar);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
  }
  .ade-mention a:hover { color: var(--ink); }

  .mt-8 { margin-top: 1.5rem; }
  .cta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
  }

  @keyframes hlrise {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
</style>
