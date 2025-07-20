<script>
  import { goto } from '$app/navigation'
  import IconifyIcon from '../IconifyIcon.svelte'
  import Apple from '../icons/Apple.svelte'
  import Banana from '../icons/Banana.svelte'
  import External from '../icons/External.svelte'
  import Grapes from '../icons/Grapes.svelte'
  import Peach from '../icons/Peach.svelte'
  import Tomato from '../icons/Tomato.svelte'
  import Watermelon from '../icons/Watermelon.svelte'

  /**
   * @typedef {object} Props
   * @property {any} i Index of the feature card
   * @property {any} title Title of the feature card
   * @property {any} description Description of the feature card
   * @property {any} [link] Link to navigate to when the card is clicked
   * @property {(e: any) => any} onkeypress Function to call when the card is pressed
   * @property {import('./types').CustomIcon} [icon] Custom icon to display in the card
   */

  /** @type {Props} */
  const {
    onkeypress = undefined,
    i,
    title,
    description,
    link = undefined,
    icon = undefined,
    noRandomIcon = false,
  } = $props()

  const external = $derived(/^https?/.test(link))

  const icons = { Apple, Banana, Grapes, Peach, Tomato, Watermelon }
  const iconsArray = Object.values(icons)

  function handleFeatureCardClick() {
    if (!link) return
    if (external) window.open(link, '_blank')
    else goto(link)
  }
</script>

<div
  class="feature-item"
  class:clickable={link}
  onclick={handleFeatureCardClick}
  {onkeypress}
  role="link"
  tabindex="0"
>
  <div class="flex justify-between items-start">
    <div class="icon">
      {#if !icon?.type}
        {#if !noRandomIcon}
          {@const SvelteComponent = iconsArray[i % iconsArray.length]}
          <SvelteComponent />
        {/if}
      {:else if icon.type === 'svg'}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html icon.value}
      {:else if icon.type === 'iconify'}
        <IconifyIcon {...icon} />
      {/if}
    </div>
    {#if external}
      <External />
    {/if}
  </div>
  <div class="feature-title">
    {title}
  </div>
  <div class="feature-desc">
    {description}
  </div>
</div>

<style>
  .clickable {
    @apply cursor-pointer;
  }
  .clickable:hover .feature-title {
    @apply underline;
  }
  .feature-title {
    @apply font-semibold mt-3;
  }
  .feature-desc {
    @apply text-slate-500 mt-3 text-sm;
  }
  .feature-item {
    @apply bg-white dark:bg-gray-900 p-4 rounded-lg hover:shadow-md transition-shadow duration-300;
  }
  .icon {
    @apply text-4xl inline-flex items-center p-1 bg-[#e5e5e5] dark:bg-[#252525] rounded-md;
  }
</style>
