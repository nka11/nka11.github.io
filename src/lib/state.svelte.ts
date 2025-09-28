// Helper function to detect browser language
function getBrowserLanguage(): string {
	if (typeof window === 'undefined') return 'en'; // SSR fallback

	// Check localStorage first
	const stored = localStorage.getItem('lang');
	if (stored) return stored;

	// Fallback to browser language
	const browserLang = navigator.language || navigator.languages?.[0] || 'en';
	return browserLang.startsWith('fr') ? 'fr' : 'en';
}

export const browsingPreferences = $state({
	lang: getBrowserLanguage(),
	/* ... */
});