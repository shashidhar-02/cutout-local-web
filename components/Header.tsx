'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Scissors,
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown,
  Layers,
  ShieldCheck,
  Code2,
  ShoppingBag,
  User,
  Sparkles,
  Globe,
  Home,
  Check,
  Zap,
} from 'lucide-react';
import { HardwareInfo, LanguageCode } from '@/lib/types';
import { DeviceBadge } from '@/features/device-status/DeviceBadge';
import { PrivacyBadge } from './PrivacyBadge';
import { TopBannerBar } from './TopBannerBar';
import { useTranslation } from '@/lib/i18n-context';

interface HeaderProps {
  hardware: HardwareInfo | null;
}

export const Header: React.FC<HeaderProps> = ({ hardware }) => {
  const { lang, setLang, t } = useTranslation();
  const pathname = usePathname();
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState<boolean>(false);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);

  // Sync dark mode preference
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

  // Close tools dropdown on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        toolsDropdownRef.current &&
        !toolsDropdownRef.current.contains(e.target as Node)
      ) {
        setIsToolsDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsToolsDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

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

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md transition-colors shadow-xs">
      <TopBannerBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-6 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Scissors className="w-4 h-4 sm:w-5 sm:h-5 -rotate-45" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">
                {t.appName}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300">
                Local AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-gray-600 dark:text-gray-300">
            <Link
              href="/"
              className={`transition-colors py-1 ${
                isActive('/')
                  ? 'text-brand-600 dark:text-brand-400 font-bold border-b-2 border-brand-500'
                  : 'hover:text-brand-600 dark:hover:text-brand-400'
              }`}
            >
              {t.menuHome}
            </Link>

            {/* Desktop Tools Dropdown */}
            <div className="relative" ref={toolsDropdownRef}>
              <button
                type="button"
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                className="flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400 transition-colors py-2 focus:outline-hidden"
                aria-expanded={isToolsDropdownOpen}
                aria-haspopup="true"
              >
                <span>{t.menuTools}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isToolsDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isToolsDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 p-2 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1 block">
                    {t.specializedTools}
                  </span>
                  <Link
                    href="/remove-background"
                    onClick={() => setIsToolsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="p-1 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600">
                      <Scissors className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-semibold block text-gray-900 dark:text-white">
                        {t.generalRemover}
                      </span>
                      <span className="text-[10px] text-gray-500">Universal background eraser</span>
                    </div>
                  </Link>
                  <Link
                    href="/transparent-background-maker"
                    onClick={() => setIsToolsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="p-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-500">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-semibold block text-gray-900 dark:text-white">
                        {t.transparentMaker}
                      </span>
                      <span className="text-[10px] text-gray-500">Instant alpha PNG export</span>
                    </div>
                  </Link>
                  <Link
                    href="/product-background-remover"
                    onClick={() => setIsToolsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="p-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-500">
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-semibold block text-gray-900 dark:text-white">
                        {t.ecommerceProducts}
                      </span>
                      <span className="text-[10px] text-gray-500">Amazon & Shopify white background</span>
                    </div>
                  </Link>
                  <Link
                    href="/profile-photo-background-remover"
                    onClick={() => setIsToolsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="p-1 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-500">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-semibold block text-gray-900 dark:text-white">
                        {t.profilePassports}
                      </span>
                      <span className="text-[10px] text-gray-500">LinkedIn & passport headshots</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/batch-background-remover"
              className={`transition-colors py-1 flex items-center gap-1 ${
                isActive('/batch-background-remover')
                  ? 'text-brand-600 dark:text-brand-400 font-bold border-b-2 border-brand-500'
                  : 'hover:text-brand-600 dark:hover:text-brand-400'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              {t.menuBatch}
            </Link>

            <Link
              href="/how-it-works"
              className={`transition-colors py-1 ${
                isActive('/how-it-works')
                  ? 'text-brand-600 dark:text-brand-400 font-bold border-b-2 border-brand-500'
                  : 'hover:text-brand-600 dark:hover:text-brand-400'
              }`}
            >
              {t.menuHowItWorks}
            </Link>

            <Link
              href="/privacy"
              className={`transition-colors py-1 ${
                isActive('/privacy')
                  ? 'text-brand-600 dark:text-brand-400 font-bold border-b-2 border-brand-500'
                  : 'hover:text-brand-600 dark:hover:text-brand-400'
              }`}
            >
              {t.menuPrivacy}
            </Link>
          </nav>
        </div>

        {/* Action Controls & Navigation Switchers */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Sleek Hardware Status Indicator */}
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
            <span
              className={`w-2 h-2 rounded-full ${
                hardware?.isWebGpu ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'
              }`}
            />
            {hardware?.isWebGpu ? 'WebGPU' : 'WASM'}
          </span>

          {/* Desktop Language Switcher */}
          <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-0.5 text-xs font-semibold border border-gray-200/80 dark:border-gray-700/80">
            {(
              [
                { code: 'en', label: 'EN', title: 'English' },
                { code: 'hi', label: 'हिन्दी', title: 'Hindi' },
                { code: 'te', label: 'తెలుగు', title: 'Telugu' },
              ] as const
            ).map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => setLang(item.code)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  lang === item.code
                    ? 'bg-white dark:bg-gray-700 text-brand-700 dark:text-brand-300 shadow-xs font-bold'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
                title={`Switch language to ${item.title}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block" />

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* GitHub Repository */}
          <a
            href="https://github.com/shashidhar-02/cutout-local-web"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </a>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay & Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Mobile Drawer Content */}
          <div className="relative bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-5 space-y-5 max-h-[calc(100vh-4rem)] overflow-y-auto shadow-2xl">
            {/* Mobile Language Switcher */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Language / भाषा / భాష
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { code: 'en', label: 'English' },
                    { code: 'hi', label: 'हिन्दी' },
                    { code: 'te', label: 'తెలుగు' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setLang(item.code)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border transition-all ${
                      lang === item.code
                        ? 'bg-brand-50 dark:bg-brand-950/80 border-brand-500 text-brand-700 dark:text-brand-300 font-bold'
                        : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span>{item.label}</span>
                    {lang === item.code && <Check className="w-3 h-3 text-brand-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Primary Navigation Links */}
            <div className="space-y-1 text-sm font-semibold text-gray-800 dark:text-gray-200 border-t border-gray-200 dark:border-gray-800 pt-3">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                  isActive('/')
                    ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>{t.menuHome}</span>
              </Link>
              <Link
                href="/how-it-works"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                  isActive('/how-it-works')
                    ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>{t.menuHowItWorks}</span>
              </Link>
              <Link
                href="/privacy"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                  isActive('/privacy')
                    ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.menuPrivacy}</span>
              </Link>
              <Link
                href="/batch-background-remover"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                  isActive('/batch-background-remover')
                    ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{t.menuBatch}</span>
              </Link>
            </div>

            {/* Mobile Specialized Tools */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 block">
                {t.specializedTools}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/remove-background"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 rounded-xl text-xs font-medium border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex flex-col gap-1"
                >
                  <Scissors className="w-4 h-4 text-brand-600" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {t.generalRemover}
                  </span>
                </Link>
                <Link
                  href="/transparent-background-maker"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 rounded-xl text-xs font-medium border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex flex-col gap-1"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {t.transparentMaker}
                  </span>
                </Link>
                <Link
                  href="/product-background-remover"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 rounded-xl text-xs font-medium border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex flex-col gap-1"
                >
                  <ShoppingBag className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {t.ecommerceProducts}
                  </span>
                </Link>
                <Link
                  href="/profile-photo-background-remover"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 rounded-xl text-xs font-medium border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex flex-col gap-1"
                >
                  <User className="w-4 h-4 text-purple-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {t.profilePassports}
                  </span>
                </Link>
              </div>
            </div>

            {/* Mobile Footer Status */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {hardware?.isWebGpu ? 'WebGPU Accelerated' : 'CPU (WASM)'}
              </span>
              <PrivacyBadge />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
