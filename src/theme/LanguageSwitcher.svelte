<script lang="ts">
  import { locale } from 'svelte-i18n';
  import { browsingPreferences } from "$lib/state.svelte";

  function changeLang(newLang: string) {
    if (locale) {
      locale.set(newLang);
    }
    browsingPreferences.lang = newLang;
    localStorage.setItem('lang', newLang);
  };
</script>

{#key browsingPreferences.lang}
  {#if browsingPreferences.lang == 'fr'}
    <button data-testid="language-switcher-button" on:click={() => changeLang('en')}>🇬🇧</button>
  {:else}
    <button data-testid="language-switcher-button" on:click={() => changeLang('fr')}>🇫🇷</button>
  {/if}
{/key}

<style>
    button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.5rem;
    }
</style>
