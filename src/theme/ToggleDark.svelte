<script>
  import { isDark } from './layout'
  import Sun from './icons/Sun.svelte'
  import Moon from './icons/Moon.svelte'

  /**
   * @type {string | undefined}
   */
  export let className = undefined

  const toggle = () => {
    isDark.set(!$isDark)
    if (typeof document !== 'undefined')
      document.documentElement.classList.toggle('dark', $isDark)
  }
</script>

<button on:click={toggle} class="flex items-center justify-center {className}" aria-label="Toggle theme">
  <Sun class="dark:hidden"/>
  <Moon class="hidden dark:block"/>
</button>
