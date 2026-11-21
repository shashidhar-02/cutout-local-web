'use client';

import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { HardwareInfo } from '@/lib/types';

interface UnsupportedBannerProps {
  hardware: HardwareInfo | null;
}

export const UnsupportedBanner: React.FC<UnsupportedBannerProps> = ({ hardware }) => {
  if (!hardware || hardware.supported) return null;

  return (
    <div className="w-full bg-red-50 dark:bg-red-950/80 border-b border-red-200 dark:border-red-900 px-4 py-3.5 text-sm text-red-800 dark:text-red-200 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
          <p>
            <strong className="font-semibold">Browser Compatibility Notice:</strong>{' '}
            {hardware.notes ||
              'Your current browser does not support WebGPU or WebAssembly. An up-to-date Chromium, Firefox, or Safari browser is required for on-device AI inference.'}
          </p>
        </div>
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800 font-medium text-xs transition-colors shrink-0"
        >
          Check Browser Support <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
