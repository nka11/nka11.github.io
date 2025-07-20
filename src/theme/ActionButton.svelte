<script>
  import External from './icons/External.svelte'
  import { getPathFromBase } from './utils'

  /**
   * @typedef {object} Props
   * @property {any} label - The text to display on the button
   * @property {string} [type] - The type of the button
   * @property {any} to - The path to navigate to
   * @property {boolean} [external] - Whether the link is external
   */

  /** @type {Props} */
  let { label, type = '', to, external = false } = $props()
</script>

<a
  href={external ? to : getPathFromBase(to)}
  class={`svp-action ${type ? `svp-action--${type}` : ''}`}
  target={external ? '_blank' : ''}
>
  <span class="label">
    {label}
  </span>
  {#if external}
    <div class="external-icon">
      <External />
    </div>
  {/if}
</a>

<style>
  .svp-action {
    display: inline-flex;
    align-items: center;
    height: 3rem;              /* h-12 = 48px */
    line-height: 3rem;         /* leading-12 = 48px */
    border-radius: 6px;        /* rounded-6 = 6px */
    padding: 0 1.5rem;         /* px-6 = 24px */
    background-color: white;
    color: inherit;
    text-decoration: none;
    transition: box-shadow 0.3s ease;
  }

  .svp-action:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* hover shadow */
  }

  .svp-action--primary {
    background: linear-gradient(to right, #4f46e5, #6366f1); /* Example gradient */
    color: white;
  }

  .dark .svp-action {
    background-color: #18181b; /* dark:bg-zinc-8 */
  }

  .dark .svp-action--primary {
    color: #f5f5f4; /* dark:text-warm-gray-8 (approximate) */
  }

  .dark .svp-action:hover {
    box-shadow: 0 2px 8px rgba(75, 85, 99, 0.4); /* dark:hover:shadow-gray-6 approximation */
  }

  .label {
    flex-grow: 1;
    text-align: center;
  }

  .external-icon {
    font-size: 1.5rem; /* text-6 = ~24px */
    margin-left: 0.5rem; /* ml-2 = 8px */
    display: flex;
    align-items: center;
  }
</style>
