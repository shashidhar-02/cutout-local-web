'use client';

import React from 'react';
import {
  ShoppingBag,
  User,
  FileCheck,
  Store,
  Share2,
  Briefcase,
  Presentation,
  Sparkles,
} from 'lucide-react';
import { SMART_PRESETS } from '@/lib/presets';
import { BackgroundSettings, CropSettings, ExportFormat, ResizeSettings, SmartPreset } from '@/lib/types';

interface SmartPresetsSelectorProps {
  onApplyPreset: (preset: SmartPreset) => void;
  activePresetId?: string;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  ShoppingBag,
  User,
  FileCheck,
  Store,
  Share2,
  Briefcase,
  Presentation,
  Sparkles,
};

export const SmartPresetsSelector: React.FC<SmartPresetsSelectorProps> = ({
  onApplyPreset,
  activePresetId,
}) => {
  return (
    <div className="space-y-3 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Smart Export Presets
        </h4>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SMART_PRESETS.map((preset) => {
          const Icon = ICON_MAP[preset.iconName] || Sparkles;
          const isActive = activePresetId === preset.id;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApplyPreset(preset)}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                isActive
                  ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/60 ring-2 ring-brand-500/20'
                  : 'border-gray-200 dark:border-gray-700/80 bg-gray-50/60 dark:bg-gray-800/40 hover:bg-gray-100/70 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isActive
                      ? 'bg-brand-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-xs'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-gray-200/80 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {preset.format}
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">
                  {preset.name}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">
                  {preset.crop.aspectRatio || 'original'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
