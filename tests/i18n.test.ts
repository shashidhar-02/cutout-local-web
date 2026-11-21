import { describe, it, expect } from 'vitest';
import { TRANSLATIONS } from '../lib/i18n';

describe('Internationalization (i18n)', () => {
  it('includes complete UI dictionaries for English, Hindi, and Telugu', () => {
    expect(TRANSLATIONS.en).toBeDefined();
    expect(TRANSLATIONS.hi).toBeDefined();
    expect(TRANSLATIONS.te).toBeDefined();

    expect(TRANSLATIONS.en.appName).toBe('Cutout');
    expect(TRANSLATIONS.hi.appName).toBe('Cutout');
    expect(TRANSLATIONS.te.appName).toBe('Cutout');

    expect(TRANSLATIONS.hi.privacyPill).toContain('डिवाइस');
    expect(TRANSLATIONS.te.privacyPill).toContain('పరికరం');

    expect(TRANSLATIONS.en.heroTitle).toBe('Remove backgrounds.');
    expect(TRANSLATIONS.hi.heroTitle).toContain('बैकग्राउंड');
    expect(TRANSLATIONS.te.heroTitle).toContain('బ్యాక్‌గ్రౌండ్');

    expect(TRANSLATIONS.en.menuHowItWorks).toBe('How It Works');
    expect(TRANSLATIONS.hi.menuHowItWorks).toBe('यह कैसे काम करता है');
    expect(TRANSLATIONS.te.menuHowItWorks).toBe('ఇది ఎలా పనిచేస్తుంది');

    // Ensure all dictionaries have matching keys
    const enKeys = Object.keys(TRANSLATIONS.en).sort();
    const hiKeys = Object.keys(TRANSLATIONS.hi).sort();
    const teKeys = Object.keys(TRANSLATIONS.te).sort();

    expect(hiKeys).toEqual(enKeys);
    expect(teKeys).toEqual(enKeys);
  });
});
