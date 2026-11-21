'use client';

import React from 'react';
import { Maximize2, Lock, Unlock, FileImage } from 'lucide-react';
import { ExportFormat, ResizeSettings } from '@/lib/types';

interface ResizeSettingsProps {
  originalWidth: number;
  originalHeight: number;
  resize: ResizeSettings;
  format: ExportFormat;
  quality: number;
  onResizeChange: (resize: ResizeSettings) => void;
  onFormatChange: (format: ExportFormat) => void;
  onQualityChange: (quality: number) => void;
}

export const ResizeSettingsPanel: React.FC<ResizeSettingsProps> = ({
  originalWidth,
  originalHeight,
  resize,
  format,
  quality,
  onResizeChange,
  onFormatChange,
  onQualityChange,
}) => {
  const setScale = (percent: number) => {
    const scale = percent / 100;
    onResizeChange({
      ...resize,
      enabled: percent !== 100,
      scalePercent: percent,
      width: Math.round(originalWidth * scale),
      height: Math.round(originalHeight * scale),
    });
  };

  const handleWidthChange = (val: number) => {
    const targetW = Math.max(1, val);
    let targetH = resize.height;
    if (resize.maintainAspectRatio && originalWidth > 0) {
      targetH = Math.round(targetW * (originalHeight / originalWidth));
    }
    onResizeChange({
      ...resize,
      enabled: true,
      scalePercent: 0,
      width: targetW,
      height: targetH,
    });
  };

  const handleHeightChange = (val: number) => {
    const targetH = Math.max(1, val);
    let targetW = resize.width;
    if (resize.maintainAspectRatio && originalHeight > 0) {
      targetW = Math.round(targetH * (originalWidth / originalHeight));
    }
    onResizeChange({
      ...resize,
      enabled: true,
      scalePercent: 0,
      width: targetW,
      height: targetH,
    });
  };

  return (
    <div className="space-y-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
          <FileImage className="w-3.5 h-3.5" />
          Export Format & Output Dimensions
        </h4>
      </div>

      {/* Format Selection (PNG / JPG / WebP) */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          File Format
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['png', 'webp', 'jpeg'] as ExportFormat[]).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => onFormatChange(fmt)}
              className={`py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                format === fmt
                  ? 'bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-950/80 dark:border-brand-500 dark:text-brand-300 shadow-sm'
                  : 'bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'
              }`}
            >
              {fmt === 'jpeg' ? 'JPG' : fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Quality Slider for WebP / JPEG */}
      {format !== 'png' && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>Compression Quality</span>
            <span className="font-mono">{Math.round(quality * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.0"
            step="0.05"
            value={quality}
            onChange={(e) => onQualityChange(Number(e.target.value))}
            className="w-full accent-brand-500 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
          />
        </div>
      )}

      {/* Preset Scale Buttons */}
      <div className="space-y-1.5 pt-1">
        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
          <span>Scale Presets</span>
          <span className="text-[11px] text-gray-400 font-normal">
            Original: {originalWidth} × {originalHeight}px
          </span>
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[100, 75, 50, 25].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => setScale(pct)}
              className={`py-1 rounded-lg text-xs font-medium transition-colors ${
                (resize.scalePercent === pct || (!resize.enabled && pct === 100))
                  ? 'bg-brand-600 text-white font-semibold shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {pct}%
            </button>
          ))}
        </div>
      </div>

      {/* Custom Width / Height Inputs */}
      <div className="grid grid-cols-2 gap-2 pt-1 items-end">
        <div>
          <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block mb-1">
            Width (px)
          </label>
          <input
            type="number"
            value={resize.width || originalWidth}
            onChange={(e) => handleWidthChange(Number(e.target.value))}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block mb-1">
            Height (px)
          </label>
          <input
            type="number"
            value={resize.height || originalHeight}
            onChange={(e) => handleHeightChange(Number(e.target.value))}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
          />
        </div>
      </div>
    </div>
  );
};
