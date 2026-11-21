'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n-context';
import { ShieldCheck, Sparkles, Zap } from 'lucide-react';

export const TopBannerBar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-600 text-white text-xs font-semibold py-2 px-4 shadow-sm border-b border-emerald-500/30">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center flex-wrap">
        <span className="flex items-center gap-1.5 bg-black/20 backdrop-blur-xs px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
          <Zap className="w-3 h-3 text-amber-300 fill-amber-300" /> WebGPU + WASM
        </span>
        <span className="truncate">{t.announcement}</span>
      </div>
    </div>
  );
};
