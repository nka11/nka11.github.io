import { unwrapFunctionStore, dictionary, locale as svelteLocale, format as _ } from 'svelte-i18n';
import { derived } from 'svelte/store';
import { browsingPreferences } from '$lib/state.svelte';
const $_ = unwrapFunctionStore(_)
function setupI18n() {
  dictionary.set({
    en: {
      'book_a_meeting': 'Book a Meeting',
      // CV Section Headers
      'cv.skills': 'Skills',
      'cv.languages': 'Languages',
      'cv.personal_projects': 'Personal Projects',
      'cv.professional_experiences': 'Professional Experiences',
      'cv.education_diplomas': 'Education and Diplomas',
      // Date range labels
      'cv.date.from': 'from',
      'cv.date.to': 'to',
      'cv.date.since': 'since',
      'cv.date.de': 'from',
      'cv.date.a': 'to',
      'cv.date.depuis': 'since',
      // Education labels
      'cv.education.level': 'Level',
      'cv.education.institution': 'Institution',
      'cv.education.address': 'Address',
    },
    fr: {
      'book_a_meeting': 'Réserver une réunion',
      // CV Section Headers
      'cv.skills': 'Compétences',
      'cv.languages': 'Langues',
      'cv.personal_projects': 'Projets Personnels',
      'cv.professional_experiences': 'Experiences Professionnelles',
      'cv.education_diplomas': 'Formations et diplômes',
      // Date range labels
      'cv.date.from': 'de',
      'cv.date.to': 'à',
      'cv.date.since': 'depuis',
      'cv.date.de': 'de',
      'cv.date.a': 'à',
      'cv.date.depuis': 'depuis',
      // Education labels
      'cv.education.level': 'Niveau',
      'cv.education.institution': 'Établissement',
      'cv.education.address': 'Adresse',
    },
  });

  // Set initial locale - browsingPreferences.lang already handles browser detection
  svelteLocale.set(browsingPreferences.lang);
}

const T = derived(svelteLocale, () => (key: string, ...args: any[]) => $_(key, ...args));

export { T, setupI18n, svelteLocale as locale };
