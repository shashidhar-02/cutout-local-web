'use client';

import React, { useRef } from 'react';
import { BackgroundSettings } from '@/lib/types';
import { Image as ImageIcon, Sliders, Palette, Check } from 'lucide-react';

interface BackgroundPickerProps {
  settings: BackgroundSettings;
  onChange: (settings: BackgroundSettings) => void;
}

const COLOR_PRESETS = [
  { label: 'Studio White', color: '#ffffff' },
  { label: 'Pure Black', color: '#000000' },
  { label: 'Warm Gray', color: '#f3f4f6' },
  { label: 'Cool Slate', color: '#334155' },
  { label: 'Chroma Green', color: '#00b140' },
  { label: 'Sky Blue', color: '#38bdf8' },
  { label: 'Royal Violet', color: '#8b5cf6' },
  { label: 'Rose Pink', color: '#f43f5e' },
  { label: 'Pastel Peach', color: '#fed7aa' },
];

export const BackgroundPicker: React.FC<BackgroundPickerProps> = ({ settings, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      onChange({
        ...settings,
        type: 'image',
        customImageUrl: url,
      });
    }
  };

  return (
    <div className="space-y-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5" />
          Background Replacement
        </h4>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-medium">
        <button
          type="button"
          onClick={() => onChange({ ...settings, type: 'transparent' })}
          className={`py-1.5 rounded-lg transition-all ${
            settings.type === 'transparent'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm font-semibold'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Transparent
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...settings, type: 'color', color: settings.color || '#ffffff' })}
          className={`py-1.5 rounded-lg transition-all ${
            settings.type === 'color'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm font-semibold'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Solid Color
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...settings, type: 'image' })}
          className={`py-1.5 rounded-lg transition-all ${
            settings.type === 'image'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm font-semibold'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Custom Photo
        </button>
      </div>

      {/* Solid Color Options */}
      {settings.type === 'color' && (
        <div className="space-y-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            {COLOR_PRESETS.map((preset) => {
              const isSelected = settings.color.toLowerCase() === preset.color.toLowerCase();
              return (
                <button
                  key={preset.color}
                  type="button"
                  title={preset.label}
                  onClick={() => onChange({ ...settings, color: preset.color })}
                  style={{ backgroundColor: preset.color }}
                  className={`w-7 h-7 rounded-full border border-gray-300 dark:border-gray-600 transition-transform flex items-center justify-center ${
                    isSelected ? 'ring-2 ring-brand-500 ring-offset-2 scale-110 shadow-sm' : 'hover:scale-105'
                  }`}
                >
                  {isSelected && (
                    <Check
                      className={`w-3.5 h-3.5 ${
                        preset.color === '#ffffff' || preset.color === '#fed7aa' || preset.color === '#f3f4f6'
                          ? 'text-gray-900'
                          : 'text-white'
                      }`}
                    />
                  )}
                </button>
              );
            })}

            {/* Custom Color Input */}
            <div className="relative flex items-center">
              <input
                type="color"
                value={settings.color || '#ffffff'}
                onChange={(e) => onChange({ ...settings, color: e.target.value })}
                className="w-7 h-7 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 cursor-pointer p-0 bg-transparent"
                title="Choose custom color"
              />
            </div>
          </div>
        </div>
      )}

      {/* Custom Image Background Options */}
      {settings.type === 'image' && (
        <div className="space-y-3 pt-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCustomImageUpload}
          />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              {settings.customImageUrl ? 'Replace Background' : 'Upload Background'}
            </button>

            {settings.customImageUrl && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Photo applied
              </span>
            )}
          </div>

          {/* Background Blur Slider */}
          {settings.customImageUrl && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3 h-3" /> Blur Effect
                </span>
                <span>{settings.blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={settings.blur}
                onChange={(e) => onChange({ ...settings, blur: Number(e.target.value) })}
                className="w-full accent-brand-500 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
