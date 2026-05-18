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
  padding: 0.4rem 0.75rem;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 0.95rem;
  color: var(--ink);
  letter-spacing: 0.01em;
  transition: color 0.2s ease;
}

.nav-item--icon {
  font-size: 1.4rem;
  color: var(--ink);
}

.nav-item--icon .dropdown {
  font-size: 1.05rem;
}

.nav-item--icon:not(:first-child)::after,
:global(.navbar-pc .toggle::after) {
  position: absolute;
  left: 0;
  background-color: var(--ink-faint);
  width: 1px;
  top: 50%;
  height: 18px;
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
  color: var(--or);
  opacity: 1;
}

/* Underline-on-hover for text nav items — civic chrome */
:global(:not(.dropdown) > .nav-item:not(.nav-item--icon)) {
  position: relative;
}
:global(:not(.dropdown) > .nav-item:not(.nav-item--icon))::after {
  content: "";
  position: absolute;
  left: 0.75rem;
  right: 0.75rem;
  bottom: 0.25rem;
  height: 2px;
  background: var(--or);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.25s cubic-bezier(0.2, 0.7, 0.2, 1);
}
:global(:not(.dropdown) > .nav-item:not(.nav-item--icon):hover) {
  color: var(--ink);
}
:global(:not(.dropdown) > .nav-item:not(.nav-item--icon):hover)::after {
  transform: scaleX(1);
}

.dropdown {
  transition: transform 0.25s ease, opacity 0.25s ease;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--paper);
  white-space: nowrap;
  z-index: 3;
  border: 1px solid var(--ink);
  border-radius: var(--radius-1, 2px);
  padding: 0.4rem;
  transform: translateY(72px);
}

:global(.dropdown > .nav-item) {
  display: block;
  padding: 0.45rem 0.9rem;
  text-decoration: none;
  border-radius: var(--radius-0, 0);
  color: var(--ink);
  background-color: transparent;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 0.9rem;
}

:global(.dropdown > .nav-item:hover) {
  background-color: var(--paper-soft);
  color: var(--or);
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
  transition: transform 0.25s ease;
  font-size: 1.2rem;
  color: var(--ink-soft);
  margin-left: 0.2rem;
}

.nav-item:hover .arrow {
  transform: rotate(180deg);
  color: var(--or);
}

/* Active link — civic underline + or, no gradient text */
.active {
  color: var(--ink);
  cursor: default;
}
:global(a.nav-item.active)::after {
  content: "";
  position: absolute;
  left: 0.75rem;
  right: 0.75rem;
  bottom: 0.25rem;
  height: 2px;
  background: var(--or);
  transform: scaleX(1);
}

</style>
