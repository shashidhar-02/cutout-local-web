'use client';

import React from 'react';
import { Crop, Sliders } from 'lucide-react';
import { CropSettings as ICropSettings } from '@/lib/types';

interface CropSettingsProps {
  settings: ICropSettings;
  onChange: (settings: ICropSettings) => void;
}

export const CropSettings: React.FC<CropSettingsProps> = ({ settings, onChange }) => {
  return (
    <div className="space-y-3 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.autoCrop}
            onChange={(e) => onChange({ ...settings, autoCrop: e.target.checked })}
            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 accent-brand-500"
          />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Crop className="w-3.5 h-3.5" />
            Auto Crop (Trim Transparent Edges)
          </span>
        </label>
      </div>

      {settings.autoCrop && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Sliders className="w-3 h-3" /> Edge Padding
            </span>
            <span>{settings.padding}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="120"
            step="4"
            value={settings.padding}
            onChange={(e) => onChange({ ...settings, padding: Number(e.target.value) })}
            className="w-full accent-brand-500 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};
