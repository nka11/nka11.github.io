import { unwrapFunctionStore, dictionary, locale as svelteLocale, format as _ } from 'svelte-i18n';
import { derived } from 'svelte/store';
import { browsingPreferences } from '$lib/state.svelte';
const $_ = unwrapFunctionStore(_)
function setupI18n() {
  dictionary.set({
    en: {
      'book_a_meeting': 'Book a Meeting',
      'home.title': 'Nicolas Karageuzian',
      'home.description': 'Software Architect & Open Source Expert',
      'home.tagline': 'Programming computers since 1987. I\'m publishing about computing science, software development and free software.',
      'home.actions.github': 'Visit my GitHub',
      'home.training.title': 'Teacher & Trainer',
      'home.training.description': 'I provide professional training as a registered provider in France through Deepthought Solutions.',
      'home.training.ade': 'Registered training company (valid ADE number).',
      'home.training.catalog': 'Deepthought catalog',
      'home.training.full_catalog': 'View full catalogue',
      'home.training.subtitle': 'Six headline offerings — drawn from a 15+ year practice as architect, security expert, and university teacher.',
      'home.training.pillars.engineering': 'Software Engineering & Quality',
      'home.training.pillars.security': 'Security & Compliance',
      'home.training.pillars.agentic_ai': 'Agentic AI',
      'home.training.pillars.sovereign_ai': 'Sovereign AI Strategy',
      'home.training.more_info': 'Visit Deepthought Solutions for more information',
      'home.training.headline.view': 'Read module',
      'home.training.headline.virtualized.title': 'Securing & operating a virtualized infrastructure',
      'home.training.headline.virtualized.lead': 'From the Linux kernel to a Kubernetes cluster — an operational journey.',
      'home.training.headline.iam_sso.title': 'Enterprise IAM/SSO — from protocol to architecture',
      'home.training.headline.iam_sso.lead': 'OAuth2, OIDC, SAML decoded, then assembled into realistic SSO architectures.',
      'home.training.headline.ebios_nis2.title': 'EBIOS-RM & NIS2 in practice for CIOs',
      'home.training.headline.ebios_nis2.lead': 'From the ANSSI framework to an actionable plan — without regulatory jargon.',
      'home.training.headline.cicd.title': 'Industrial CI/CD — Git → pipeline → production',
      'home.training.headline.cicd.lead': 'A robust, tested, observable delivery chain for real organisations.',
      'home.training.headline.semantic.title': 'Semantic web for developers',
      'home.training.headline.semantic.lead': 'RDF, SPARQL, ontologies — illustrated by this very semantic CV.',
      'home.training.headline.genai.title': 'Tooled generative AI for dev teams',
      'home.training.headline.genai.lead': 'Claude, Gemini, Antigravity — not a demo, but daily tooling.',
      'nav.articles': 'Articles',
      'nav.trainings': 'Trainings',
      'nav.print': 'Print',
      // CV Section Headers
      'cv.skills': 'Skills',
      'cv.languages': 'Languages',
      'cv.personal_projects': 'Personal Projects and other experiences',
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
      'home.title': 'Nicolas Karageuzian',
      'home.description': 'Architecte Logiciel & Expert Open Source',
      'home.tagline': 'Développeur depuis 1987. Je publie sur l\'informatique, le développement logiciel et le logiciel libre.',
      'home.actions.github': 'Visiter mon GitHub',
      'home.training.title': 'Enseignant & Formateur',
      'home.training.description': 'J\'exerce en tant que formateur professionnel enregistré en France via Deepthought Solutions.',
      'home.training.ade': 'Organisme de formation enregistré (numéro ADE valide).',
      'home.training.catalog': 'Catalogue Deepthought',
      'home.training.full_catalog': 'Voir le catalogue complet',
      'home.training.subtitle': 'Six offres phares — issues d\'une pratique de plus de 15 ans en architecture, sécurité et enseignement.',
      'home.training.pillars.engineering': 'Génie Logiciel & Qualité',
      'home.training.pillars.security': 'Sécurité & Conformité',
      'home.training.pillars.agentic_ai': 'IA Agentique',
      'home.training.pillars.sovereign_ai': 'Stratégie IA Souveraine',
      'home.training.more_info': 'Visitez Deepthought Solutions pour plus d\'informations',
      'home.training.headline.view': 'Lire le module',
      'home.training.headline.virtualized.title': 'Sécuriser et opérer une infrastructure virtualisée',
      'home.training.headline.virtualized.lead': 'Du noyau Linux au cluster Kubernetes — un parcours opérationnel.',
      'home.training.headline.iam_sso.title': 'IAM/SSO en entreprise — du protocole à l\'architecture',
      'home.training.headline.iam_sso.lead': 'OAuth2, OIDC, SAML décortiqués, puis assemblés en architecture SSO réaliste.',
      'home.training.headline.ebios_nis2.title': 'EBIOS-RM & NIS2 en pratique pour DSI',
      'home.training.headline.ebios_nis2.lead': 'Du référentiel ANSSI au plan d\'action, sans charabia réglementaire.',
      'home.training.headline.cicd.title': 'CI/CD industriel — Git → pipeline → production',
      'home.training.headline.cicd.lead': 'Une chaîne de livraison robuste, testée et observable pour de vraies organisations.',
      'home.training.headline.semantic.title': 'Web sémantique pour développeurs',
      'home.training.headline.semantic.lead': 'RDF, SPARQL, ontologies — illustrés par ce CV sémantique lui-même.',
      'home.training.headline.genai.title': 'IA générative outillée pour équipes de dev',
      'home.training.headline.genai.lead': 'Claude, Gemini, Antigravity — non pas une démo, mais un outillage quotidien.',
      'nav.articles': 'Articles',
      'nav.trainings': 'Formations',
      'nav.print': 'Imprimer',
      // CV Section Headers
      'cv.skills': 'Compétences',
      'cv.languages': 'Langues',
      'cv.personal_projects': 'Projets Personnels et autres expériences',
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
