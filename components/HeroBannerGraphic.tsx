'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, ShieldCheck, Zap, Sliders, CheckCircle2, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n-context';

interface HeroBannerGraphicProps {
  onSelectSample?: (sampleType: 'sneaker' | 'portrait') => void;
}

export const HeroBannerGraphic: React.FC<HeroBannerGraphicProps> = ({ onSelectSample }) => {
  const { t } = useTranslation();
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [activeBanner, setActiveBanner] = useState<'product' | 'portrait'>('product');

  const bannerSrc =
    activeBanner === 'product'
      ? '/banner-cutout-preview.svg'
      : '/banner-portrait-cutout.svg';

  return (
    <div className="w-full max-w-5xl mx-auto space-y-3">
      {/* Top Banner Category Tabs & Visual Cue */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveBanner('product')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeBanner === 'product'
                ? 'bg-white dark:bg-gray-700 text-brand-700 dark:text-brand-300 shadow-xs font-bold'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            👟 Product E-Commerce Banner
          </button>
          <button
            type="button"
            onClick={() => setActiveBanner('portrait')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeBanner === 'portrait'
                ? 'bg-white dark:bg-gray-700 text-brand-700 dark:text-brand-300 shadow-xs font-bold'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            👤 Portrait & Person Banner
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <Zap className="w-3.5 h-3.5" /> WebGPU 90ms
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Zero Uploads
          </span>
        </div>
      </div>

      {/* Main Interactive Visual Banner Image Card */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-gray-200/90 dark:border-gray-800 bg-gray-950 shadow-2xl group select-none">
        <div className="relative aspect-[16/9] sm:aspect-[2.15/1] w-full overflow-hidden">
          {/* Transparent Cutout Base Image (Right Side / Full Canvas) */}
          <div className="absolute inset-0 bg-checkerboard-pattern dark:bg-checkerboard-pattern-dark bg-checkerboard">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bannerSrc}
              alt="Cutout Background Removal Showcase Banner"
              className="w-full h-full object-cover object-center pointer-events-none"
            />
          </div>

          {/* Interactive Comparison Split Slider Line & Controller */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_16px_rgba(0,0,0,0.8)] cursor-ew-resize z-20 flex items-center justify-center transition-opacity"
            style={{ left: `${sliderPos}%` }}
          >
            <input
              type="range"
              min="5"
              max="95"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              aria-label="Drag before and after split slider"
              className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
            />
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-gray-900 border-2 border-brand-500 shadow-xl flex items-center justify-center text-gray-900 dark:text-white text-xs font-extrabold pointer-events-none group-hover:scale-110 transition-transform">
              ↔
            </div>
          </div>
        </div>
      </div>

      {/* Caption & Interactive Note */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1 pt-1">
        <span className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          {t.cutoutLabel}: 100% Browser Local AI (RMBG-1.4 Neural Engine)
        </span>
        <span className="text-[11px] text-gray-400 hidden sm:inline">
          Drag the center handle ↔ to inspect edge hair & shadow transparency
        </span>
      </div>
    </div>
  );
};
