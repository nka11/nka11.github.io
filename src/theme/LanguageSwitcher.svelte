<script lang="ts">
  import { locale } from 'svelte-i18n';
  import { browsingPreferences } from "$lib/state.svelte";
    import { onMount } from 'svelte';
  let lang = $state('en')
  function changeLang(newLang: string) {
    if (locale) {
      locale.set(newLang);
    }
    lang = newLang
    browsingPreferences.lang = newLang;
    localStorage.setItem('lang', newLang);
  };
  onMount(async () => {
    lang = browsingPreferences.lang
  })
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
