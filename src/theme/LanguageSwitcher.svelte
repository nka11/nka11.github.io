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

<select
  data-testid="language-switcher-select"
  on:change={(e) => changeLang(e.currentTarget.value)}
  bind:value={browsingPreferences.lang}
>
  <option value="en">🇬🇧 English</option>
  <option value="fr">🇫🇷 Français</option>
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
