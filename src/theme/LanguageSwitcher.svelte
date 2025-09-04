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
    // Check if already stored in preferences/localStorage
    let savedLang = browsingPreferences.lang || localStorage.getItem('lang');

    if (!savedLang) {
      // Fallback to browser setting
      const browserLang = navigator.language || navigator.languages?.[0] || "en";
      savedLang = browserLang.startsWith("fr") ? "fr" : "en";
    }

    changeLang(savedLang);
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
    border: none;
    cursor: pointer;
    font-size: 1rem;
    padding: 0.5rem;
  }
</style>
