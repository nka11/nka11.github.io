<script lang="ts">
  import { locale } from 'svelte-i18n';
  import { browsingPreferences } from "$lib/state.svelte";
  import { onMount } from 'svelte';

  let lang: string;

  function changeLang(newLang: string) {
    locale.set(newLang);
    lang = newLang;
    browsingPreferences.lang = newLang;
    localStorage.setItem('lang', newLang);
  }

  onMount(() => {
    // browsingPreferences.lang already handles browser detection and localStorage
    changeLang(browsingPreferences.lang);
  });
</script>

<select
  data-testid="language-switcher-select"
  onchange={(e) => changeLang(e.currentTarget.value)}
  bind:value={lang}
>
  <option value="en">🇬🇧</option>
  <option value="fr">🇫🇷</option>
</select>

<style>
  select {
    background: none;
    border: 1px solid var(--ink-faint);
    border-radius: var(--radius-1, 2px);
    cursor: pointer;
    font-size: 1rem;
    padding: 0.25rem 0.4rem;
    color: var(--ink);
    transition: border-color 0.2s ease;
  }
  select:hover {
    border-color: var(--or);
  }
</style>
