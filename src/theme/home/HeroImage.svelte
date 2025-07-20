<script>
  import siteConfig from 'virtual:sveltepress/site'
  import { parseImageSrc } from '../utils'

  const { heroImage } = $props()
</script>

<div class="hero-image">
  <img src={parseImageSrc(heroImage)} alt={siteConfig.title} width="192" />
</div>

<style>
  .hero-image {
    display: flex;
    align-items: center;
    justify-content: center;

    /* Grid related (interpreting the col-span and col-start utilities) */
    grid-column-start: 4;
    grid-column-end: span 6;

    /* For small screens (sm), override grid column */
  }

  @media (min-width: 640px) {
    .hero-image {
      grid-column-start: 8;
      grid-column-end: span 5;
    }
  }

  .hero-image img {
    width: 100%;
    max-width: 220px;
  }

  @media (min-width: 640px) {
    .hero-image img {
      width: 15rem; /* 60 * 0.25rem = 15rem */
    }
  }
</style>
