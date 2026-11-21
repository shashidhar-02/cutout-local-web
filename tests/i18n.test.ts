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
  });
});
