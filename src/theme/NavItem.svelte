<script>
  import { page } from '$app/stores'
  import External from './icons/External.svelte'
  import NavArrowDown from './icons/NavArrowDown.svelte'
  // eslint-disable-next-line import/no-self-import
  import Self from './NavItem.svelte'
  import { getPathFromBase } from './utils'

  /**
   * @typedef {object} Props
   * @property {string} [title] - Link title
   * @property {string} [to] - Link URL
   * @property {any} [items] - Submenu items
   * @property {string | boolean} [icon] - Icon
   * @property {boolean} [external] - Whether the link is external
   * @property {boolean} [builtInIcon] - Whether the icon is built-in
   * @property {import('svelte').Snippet} [children] - Children content
   */

  /** @type {Props & { [key: string]: any }} */
  const {
    title = '',
    to = '/',
    items = [],
    icon = false,
    external = false,
    builtInIcon = false,
    children,
    ...rest
  } = $props()

  let active = $derived(
    $page.url.pathname.startsWith(`${to.endsWith('/') ? to : `${to}/`}`),
  )
  // eslint-disable-next-line no-unused-expressions
  rest
</script>

{#if items && items.length}
  <div
    class="nav-item"
    class:built-in-icon={builtInIcon}
    class:nav-item--icon={icon}
    class:nav-item--user-icon={icon}
    role="link"
    aria-label={title}
  >
    {#if typeof icon === 'string'}
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html icon}
    {:else}
      {title}
      <div class="arrow">
        <NavArrowDown />
      </div>
    {/if}
    <div class="dropdown">
      {#each items as subItem}
        <Self {...subItem} />
      {/each}
    </div>
  </div>
{:else}
  <a
    href={external ? to : getPathFromBase(to)}
    class:nav-item--icon={icon}
    class="nav-item"
    class:active
    {...external ? { target: '_blank' } : {}}
    aria-label={title}
  >
    {#if children}{@render children()}{:else}
      {#if typeof icon === 'string'}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html icon}
      {:else}
        {title}
      {/if}
      {#if external}
        <External />
      {/if}
    {/if}
  </a>
{/if}

<style>
.nav-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  text-decoration: none;
  padding-left: 0.75rem; /* px-3 */
  padding-right: 0.75rem;
}

.nav-item--icon {
  font-size: 1.5rem; /* text-6 */
}

.nav-item--icon .dropdown {
  font-size: 1.125rem; /* text-4 */
}

.nav-item--icon:not(:first-child)::after,
:global(.navbar-pc .toggle::after) {
  position: absolute;
  left: 0;
  background-color: #e7e5e4; /* bg-stone-2 */
  width: 1px;
  top: 50%;
  height: 20px;
  content: ' ';
  transform: translateY(-50%);
}

@media (min-width: 640px) {
  .nav-item--icon:first-of-type::after {
    display: unset;
  }
}

.nav-item--icon:first-of-type::after {
  display: none;
}

.nav-item--icon:hover {
  opacity: 0.8;
}

:global(:not(.dropdown) > .nav-item:not(.nav-item--icon):hover) {
  background-image: linear-gradient(to right, #0ea5e9, #6366f1); /* svp-gradient-text (example) */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.dropdown {
  transition: transform 0.3s, opacity 0.3s;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  top: 0;
  right: 0;
  background-color: white;
  background-color: #232323; /* dark mode fallback */
  white-space: nowrap;
  z-index: 3;
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  transform: translateY(72px);
}

:global(.dropdown > .nav-item) {
  display: block;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  text-decoration: none;
  border-radius: 0.25rem;
  color: #213547;
  background-color: transparent;
}

:global(.dropdown > .nav-item:hover) {
  background-color: rgba(14, 165, 233, 0.2); /* svp-primary + opacity */
  color: #0ea5e9;
  background-image: none;
}

.nav-item:hover .dropdown {
  opacity: 1;
  pointer-events: initial;
  transform: translateY(54px);
}

.arrow {
  display: flex;
  align-items: center;
  transition: transform 0.3s;
  font-size: 1.5rem;
  color: #213547;
  color: #cccccc; /* dark:text-light-4 fallback */
}

.nav-item:hover .arrow {
  transform: rotate(180deg);
}

.active {
  background-image: linear-gradient(to right, #0ea5e9, #6366f1); /* svp-gradient-text */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: default;
}

</style>
