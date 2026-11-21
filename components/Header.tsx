'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Scissors, Moon, Sun, Globe } from 'lucide-react';
import { HardwareInfo, LanguageCode } from '@/lib/types';
import { DeviceBadge } from '@/features/device-status/DeviceBadge';
import { PrivacyBadge } from './PrivacyBadge';
import { TRANSLATIONS } from '@/lib/i18n';

interface HeaderProps {
  hardware: HardwareInfo | null;
  onLanguageChange?: (lang: LanguageCode) => void;
  currentLang?: LanguageCode;
}

export const Header: React.FC<HeaderProps> = ({
  hardware,
  onLanguageChange,
  currentLang = 'en',
}) => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [lang, setLang] = useState<LanguageCode>(currentLang);

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const handleLangToggle = (selected: LanguageCode) => {
    setLang(selected);
    if (onLanguageChange) onLanguageChange(selected);
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Scissors className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">
                  {t.appName}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300">
                  Local AI
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                {t.tagline}
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 text-xs font-semibold text-gray-600 dark:text-gray-300">
            <Link href="/how-it-works" className="hover:text-brand-600 transition-colors">
              How It Works
            </Link>
            <Link href="/privacy" className="hover:text-brand-600 transition-colors">
              Privacy Architecture
            </Link>
            <Link href="/batch-background-remover" className="hover:text-brand-600 transition-colors">
              Batch Mode
            </Link>
          </nav>
        </div>

        {/* Runtime Badges, Language Selector & Links */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 text-xs font-semibold">
            {(['en', 'hi', 'te'] as LanguageCode[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => handleLangToggle(l)}
                className={`px-2 py-1 rounded-md uppercase transition-all ${
                  lang === l
                    ? 'bg-white dark:bg-gray-700 text-brand-700 dark:text-brand-300 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <PrivacyBadge className="hidden xl:inline-flex" />
          <DeviceBadge hardware={hardware} />

          <div className="h-5 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block" />

          {/* Dark Mode Button */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* GitHub Repository */}
          <a
            href="https://github.com/your-username/cutout-local-web"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};
