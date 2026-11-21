'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LanguageCode } from './types';
import { TRANSLATIONS, TranslationDictionary } from './i18n';

interface I18nContextValue {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: TranslationDictionary;
}

const I18nContext = createContext<I18nContextValue>({
  lang: 'en',
  setLang: () => {},
  t: TRANSLATIONS.en,
});

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<LanguageCode>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cutout_lang') as LanguageCode;
      if (stored && (stored === 'en' || stored === 'hi' || stored === 'te')) {
        setLangState(stored);
      }
    } catch {}
  }, []);

  const setLang = (newLang: LanguageCode) => {
    setLangState(newLang);
    try {
      localStorage.setItem('cutout_lang', newLang);
    } catch {}
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export function useTranslation(): I18nContextValue {
  return useContext(I18nContext);
}
