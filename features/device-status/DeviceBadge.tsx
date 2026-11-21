'use client';

import React from 'react';
import { Cpu, Zap, HelpCircle, ShieldCheck } from 'lucide-react';
import { HardwareInfo } from '@/lib/types';

interface DeviceBadgeProps {
  hardware: HardwareInfo | null;
  className?: string;
}

export const DeviceBadge: React.FC<DeviceBadgeProps> = ({ hardware, className = '' }) => {
  if (!hardware) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 animate-pulse ${className}`}>
        <div className="w-2 h-2 rounded-full bg-gray-400" />
        Detecting runtime...
      </div>
    );
  }

  const isWebGpu = hardware.isWebGpu;

  return (
    <div
      title={hardware.notes || (isWebGpu ? 'Running via WebGPU hardware acceleration' : 'Running via multi-threaded WebAssembly')}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all shadow-sm ${
        isWebGpu
          ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800'
          : 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800'
      } ${className}`}
    >
      {isWebGpu ? (
        <>
          <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
          <span className="font-semibold tracking-wide">WebGPU</span>
          <span className="hidden sm:inline text-blue-500/80 dark:text-blue-400/80 text-[10px] uppercase font-mono">
            Accelerated
          </span>
        </>
      ) : (
        <>
          <Cpu className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span className="font-semibold tracking-wide">WASM CPU</span>
          <span className="hidden sm:inline text-amber-500/80 dark:text-amber-400/80 text-[10px] uppercase font-mono">
            Fallback
          </span>
        </>
      )}
    </div>
  );
};
