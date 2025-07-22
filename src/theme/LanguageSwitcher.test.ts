import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, beforeEach } from 'vitest';
import LanguageSwitcher from './LanguageSwitcher.svelte';
import { browsingPreferences } from '$lib/state.svelte';

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    localStorage.clear();
    browsingPreferences.lang = 'en'; // Reset to default
  });

  it('should switch language from en to fr', async () => {
    const { getByText } = render(LanguageSwitcher);
    const button = getByText('🇫🇷');
    await fireEvent.click(button);
    expect(browsingPreferences.lang).toBe('fr');
    expect(localStorage.getItem('lang')).toBe('fr');
  });

  it('should switch language from fr to en', async () => {
    browsingPreferences.lang = 'fr';
    const { getByText } = render(LanguageSwitcher);
    const button = getByText('🇬🇧');
    await fireEvent.click(button);
    expect(browsingPreferences.lang).toBe('en');
    expect(localStorage.getItem('lang')).toBe('en');
  });
});
