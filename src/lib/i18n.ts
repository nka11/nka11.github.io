import { dictionary, locale as svelteLocale, _ } from 'svelte-i18n';
import { derived } from 'svelte/store';
import { browsingPreferences } from '$lib/state.svelte';

function setupI18n() {
  dictionary.set({
    en: {
      'book_a_meeting': 'Book a Meeting',
    },
    fr: {
      'book_a_meeting': 'Réserver une réunion',
    },
  });

  svelteLocale.set(browsingPreferences.lang);
}

const T = derived(svelteLocale, $locale => (key, ...args) => _().t(key, ...args));

export { T, setupI18n, svelteLocale as locale };
