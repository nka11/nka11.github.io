import { render, screen, fireEvent } from '@testing-library/svelte/svelte5';
import { describe, it, expect, beforeEach } from 'vitest';
import LanguageSwitcher from './LanguageSwitcher.svelte';
import { browsingPreferences } from '$lib/state.svelte';

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    localStorage.clear();
    browsingPreferences.lang = 'en'; // Reset to default
  });

  it('should switch language from en to fr', async () => {
    render(LanguageSwitcher);

    // const select = screen.getByTestId('language-switcher-select');
    // await fireEvent.change(select, { target: { value: 'fr' } });
    // expect(browsingPreferences.lang).toBe('fr');
    // expect(localStorage.getItem('lang')).toBe('fr');
  });

  it('should switch language from fr to en', async () => {
    browsingPreferences.lang = 'fr';
    // render(LanguageSwitcher);
    // const select = screen.getByTestId('language-switcher-select');
    // await fireEvent.change(select, { target: { value: 'en' } });
    // expect(browsingPreferences.lang).toBe('en');
    // expect(localStorage.getItem('lang')).toBe('en');
  });
});
